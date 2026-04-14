from flask import Flask, request
from flask_cors import CORS
from collections import Counter
import stanza
import json
import re

from math import log
from scipy.stats import chi2
from statsmodels.stats.multitest import multipletests

_nlp = None


def get_nlp():
    global _nlp

    if _nlp is not None:
        return _nlp

    try:
        _nlp = stanza.Pipeline(
            "et",
            processors="tokenize,mwt,pos",
            package="edt",
            use_gpu=False,
        )
    except Exception:
        stanza.download("et")
        _nlp = stanza.Pipeline(
            "et",
            processors="tokenize,mwt,pos",
            package="edt",
            use_gpu=False,
        )

    return _nlp


app = Flask(__name__)
CORS(app)

get_nlp()

with open("baas_osakaalud.json", "r", encoding="utf-8") as f:
    baas = json.load(f)

MAX_LEN = 5


def normalize_xpos_tag(tag):
    if not tag:
        return None

    normalized = str(tag).strip()
    if not normalized:
        return None

    if len(normalized) != 1:
        return "T"

    return normalized


def log_likelihood_test(sisendi_arv, sisendi_kokku, baasi_arv, baasi_kokku):
    if sisendi_kokku <= 0 or baasi_kokku <= 0:
        return {
            "meetod": "none",
            "p": 1.0,
            "g2": 0.0,
            "suund": "equal",
            "sisendi_osakaal": 0.0,
            "baasi_osakaal": 0.0,
        }

    p1 = sisendi_arv / sisendi_kokku
    p2 = baasi_arv / baasi_kokku

    tabel = [
        [sisendi_arv, sisendi_kokku - sisendi_arv],
        [baasi_arv, baasi_kokku - baasi_arv],
    ]

    rea_summad = [sum(rida) for rida in tabel]
    veeru_summad = [tabel[0][0] + tabel[1][0], tabel[0][1] + tabel[1][1]]
    koondsumma = sum(rea_summad)

    if koondsumma <= 0:
        g2 = 0.0
        p = 1.0
    else:
        g2 = 0.0
        for rea_indeks in range(2):
            for veeru_indeks in range(2):
                vaadeldud = tabel[rea_indeks][veeru_indeks]
                oodatud = (rea_summad[rea_indeks] * veeru_summad[veeru_indeks]) / koondsumma

                if vaadeldud <= 0 or oodatud <= 0:
                    continue

                g2 += 2.0 * vaadeldud * log(vaadeldud / oodatud)

        p = chi2.sf(g2, df=1)

    suund = "up" if p1 > p2 else ("down" if p1 < p2 else "equal")
    return {
        "meetod": "log-likelihood",
        "p": float(p),
        "g2": float(g2),
        "suund": suund,
        "sisendi_osakaal": float(p1),
        "baasi_osakaal": float(p2),
    }


SPACE_BEFORE_PUNCT_RE = re.compile(r"\s+([,.;:!?\u2026])")
SPACE_BEFORE_OPEN_BRACKET_RE = re.compile(r"(?<=[^\s([{\-])([(\[])")
SPACE_AFTER_OPEN_BRACKET_RE = re.compile(r"([(\[])\s+")
SPACE_BEFORE_CLOSE_BRACKET_RE = re.compile(r"\s+([)\]])")
SPACE_AFTER_CLOSE_BRACKET_RE = re.compile(r"([)\]])(?=[^\s,.;:!?\u2026)\]])")
SPACE_AFTER_PUNCT_RE = re.compile(
    r"([;!?\u2026])(?=[^\s,.;:!?\u2026)\]])|([,.:])(?=[^\s,.;:!?\u2026)\]\d])"
)
DASH_SPACING_RE = re.compile(r"\s*([\u2013\u2014])\s*")


def fix_sentence_spacing(s: str) -> str:
    s = SPACE_BEFORE_PUNCT_RE.sub(r"\1", s)
    s = SPACE_BEFORE_OPEN_BRACKET_RE.sub(r" \1", s)
    s = SPACE_AFTER_OPEN_BRACKET_RE.sub(r"\1", s)
    s = SPACE_BEFORE_CLOSE_BRACKET_RE.sub(r"\1", s)
    s = SPACE_AFTER_CLOSE_BRACKET_RE.sub(r"\1 ", s)
    s = SPACE_AFTER_PUNCT_RE.sub(lambda m: f"{m.group(1) or m.group(2)} ", s)
    s = DASH_SPACING_RE.sub(r" \1 ", s)
    s = re.sub(r"\s{2,}", " ", s)

    return s.strip()


@app.route("/process", methods=["POST"])
def process_text():
    paring = request.json or {}

    tekst = fix_sentence_spacing(paring.get("text", "") or "")
    alpha = float(paring.get("alpha", 0.05))

    dokument = get_nlp()(tekst)
    laused = []

    for lause in dokument.sentences:
        tokeni_nihked = []
        sonaliigi_koodid = []
        sonad_tekstina = []

        kehtivad_sonad = [sona for sona in lause.words if sona.start_char is not None]
        if not kehtivad_sonad:
            continue

        lause_algus = min(sona.start_char for sona in kehtivad_sonad)
        lause_lopp = max(sona.end_char for sona in kehtivad_sonad)

        for sona in lause.words:
            tag = normalize_xpos_tag(sona.xpos)
            if not tag:
                continue

            if tag == "Z":
                continue

            if sona.start_char is None or sona.end_char is None:
                continue

            tokeni_tekst = tekst[sona.start_char:sona.end_char]
            sonad_tekstina.append(tokeni_tekst)
            sonaliigi_koodid.append(tag)
            tokeni_nihked.append(
                {
                    "token": tokeni_tekst,
                    "algus": sona.start_char,
                    "lopp": sona.end_char,
                }
            )

        laused.append(
            {
                "tekst": tekst[lause_algus:lause_lopp],
                "algus": lause_algus,
                "lopp": lause_lopp,
                "sonaliigid": sonaliigi_koodid,
                "sonad": sonad_tekstina,
                "tokeni_nihked": tokeni_nihked,
            }
        )

    sisendi_loendur = {k: Counter() for k in range(1, MAX_LEN + 1)}
    for lause in laused:
        sonaliigi_koodid = lause["sonaliigid"]
        koodide_arv = len(sonaliigi_koodid)
        for pikkus in range(1, min(MAX_LEN, koodide_arv) + 1):
            for algus_indeks in range(koodide_arv - pikkus + 1):
                voti = ",".join(sonaliigi_koodid[algus_indeks: algus_indeks + pikkus])
                sisendi_loendur[pikkus][voti] += 1

    sisendi_kokku = {k: sum(sisendi_loendur[k].values()) for k in range(1, MAX_LEN + 1)}
    baas_kokku = {k: max(1, baas[str(k)]["kokku"]) for k in range(1, MAX_LEN + 1)}

    testid_pikkuse_kaupa = {k: {} for k in range(1, MAX_LEN + 1)}

    for pikkus in range(1, MAX_LEN + 1):
        sisendi_kokku_pikkuses = sisendi_kokku[pikkus]
        baasi_kokku_pikkuses = baas_kokku[pikkus]
        if sisendi_kokku_pikkuses == 0 or baasi_kokku_pikkuses == 0:
            continue

        for voti, sisendi_arv in sisendi_loendur[pikkus].items():
            baasi_arv = baas[str(pikkus)]["jarjestused"].get(voti, 0)
            testi_tulemus = log_likelihood_test(
                sisendi_arv,
                sisendi_kokku_pikkuses,
                baasi_arv,
                baasi_kokku_pikkuses,
            )
            testid_pikkuse_kaupa[pikkus][voti] = testi_tulemus

    for pikkus in range(1, MAX_LEN + 1):
        votmed = list(testid_pikkuse_kaupa[pikkus].keys())
        if not votmed:
            continue

        pvals = [testid_pikkuse_kaupa[pikkus][voti]["p"] for voti in votmed]
        _, pvals_adj, _, _ = multipletests(pvals, alpha=alpha, method="fdr_bh")
        for voti, padj in zip(votmed, pvals_adj):
            testid_pikkuse_kaupa[pikkus][voti]["p_adj"] = float(padj)

    ebatyypilised_naited = []
    koik_naited = []

    for lause in laused:
        sonaliigi_koodid = lause["sonaliigid"]
        koodide_arv = len(sonaliigi_koodid)
        if koodide_arv == 0:
            continue

        ebatyypilised_lauses = []
        koik_lauses = []

        for pikkus in range(1, min(MAX_LEN, koodide_arv) + 1):
            sisendi_kokku_pikkuses = sisendi_kokku[pikkus]
            baasi_kokku_pikkuses = baas_kokku[pikkus]
            if sisendi_kokku_pikkuses == 0 or baasi_kokku_pikkuses == 0:
                continue

            for algus_indeks in range(koodide_arv - pikkus + 1):
                voti = ",".join(
                    sonaliigi_koodid[algus_indeks: algus_indeks + pikkus]
                )

                testi_tulemus = testid_pikkuse_kaupa[pikkus].get(voti)
                if not testi_tulemus:
                    continue

                valiku_koodid = sonaliigi_koodid[algus_indeks: algus_indeks + pikkus]
                indeksid = list(range(algus_indeks, algus_indeks + pikkus))
                algus_nihe = (
                    lause["tokeni_nihked"][indeksid[0]]["algus"] - lause["algus"]
                )
                lopu_nihe = (
                    lause["tokeni_nihked"][indeksid[-1]]["lopp"] - lause["algus"]
                )

                vaste = {
                    "algus": algus_nihe,
                    "lopp": lopu_nihe,
                    "globaalne_algus": lause["tokeni_nihked"][indeksid[0]]["algus"],
                    "globaalne_lopp": lause["tokeni_nihked"][indeksid[-1]]["lopp"],
                    "koodid": valiku_koodid,
                }
                koik_lauses.append(vaste)

                kasutatav_p = testi_tulemus.get("p_adj", testi_tulemus["p"])
                on_ebatyypiline = kasutatav_p < alpha

                if on_ebatyypiline:
                    ebatyypilised_lauses.append(
                        {
                            **vaste,
                            "statistika": {
                                "meetod": testi_tulemus["meetod"],
                                "p": testi_tulemus["p"],
                                "p_adj": testi_tulemus.get("p_adj"),
                                "g2": testi_tulemus["g2"],
                                "suund": testi_tulemus["suund"],
                                "sisendi_osakaal": testi_tulemus["sisendi_osakaal"],
                                "baasi_osakaal": testi_tulemus["baasi_osakaal"],
                                "sisendi_arv": sisendi_loendur[pikkus].get(voti, 0),
                                "baasi_arv": baas[str(pikkus)]["jarjestused"].get(voti, 0),
                                "sisendi_kokku": sisendi_kokku_pikkuses,
                                "baasi_kokku": baasi_kokku_pikkuses,
                            },
                        }
                    )

        if koik_lauses:
            koik_naited.append(
                {
                    "tekst": lause["tekst"],
                    "algus": lause["algus"],
                    "esinemised": koik_lauses,
                }
            )

        if ebatyypilised_lauses:
            ebatyypilised_naited.append(
                {
                    "tekst": lause["tekst"],
                    "algus": lause["algus"],
                    "esinemised": ebatyypilised_lauses,
                }
            )

    koondandmed = {}
    for pikkus in range(1, MAX_LEN + 1):
        baas_jarjestused = {
            voti: baas[str(pikkus)]["jarjestused"].get(voti, 0)
            for voti in sisendi_loendur[pikkus].keys()
        }

        koondandmed[str(pikkus)] = {
            "kokku": sisendi_kokku[pikkus],
            "jarjestused": dict(sisendi_loendur[pikkus]),
            "baas_kokku": baas[str(pikkus)]["kokku"],
            "baas_jarjestused": baas_jarjestused,
            "testid": testid_pikkuse_kaupa[pikkus],
            "alpha": alpha,
        }

    vastus = {
        "ebatyypilised_naited": ebatyypilised_naited,
        "koik_naited": koik_naited,
        "koondandmed": koondandmed,
    }
    return app.response_class(
        response=json.dumps(vastus, ensure_ascii=False),
        status=200,
        mimetype="application/json",
    )


if __name__ == "__main__":
    app.run(debug=True)

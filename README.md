# Sõnaliigijärjendite eristaja demoversioon

See repositoorium sisaldab demorakendust, mis analüüsib eestikeelses sisendtekstis esinevaid sõnaliigijärjendeid.

Rakendus kasutab faili `baas_osakaalud.json`, mille koostamise skript ja logifail on esitatud eraldi repositooriumis [`sonaliigijarjendite-eristaja-vordlusandmestiku-loomine`](https://github.com/esteroja/sonaliigijarjendite-eristaja-vordlusandmestiku-loomine). Taustarakendus võrdleb sisendtekstist leitud sõnaliigijärjendeid selle baasmaterjaliga ning tagastab tulemused kasutajaliidesele.

## Projekti struktuur

- `backend.py` on Flaski taustarakendus.
- `baas_osakaalud.json` on taustarakenduse kasutatav võrdlusandmestik.
- `sonaliigid/` sisaldab React + Vite kasutajaliidest.

## Mida rakendus teeb

Rakendus:

1. võtab kasutajalt sisendteksti,
2. märgendab teksti Stanza abil eestikeelsete sõnaliikidega,
3. moodustab 1- kuni 5-pikkused sõnaliigijärjendid,
4. võrdleb nende sagedusi baaskorpuse sagedustega,
5. toob esile järjendid, mis on sisendtekstis ebatavaliselt sagedased või harvad.

Kasutajaliides kuvab tulemusi mitmes vaates, sealhulgas üldvaates, ebatüüpiliste järjendite vaates ja puuvaates.

## Seos teise repositooriumiga

See demo kasutab järgmise repositooriumi abil koostatud võrdlusandmestikku:

- `sonaliigijarjendite-eristaja-vordlusandmestiku-loomine`

Seal on esitatud faili `baas_osakaalud.json` koostamise skript ja töötlemise logifail. Käesolev repositoorium kasutab sama JSON-faili `backend.py` kaudu võrdlusmaterjalina.

## Kohalik käivitamine

### Taustarakendus

Enne käivitamist peab fail `baas_osakaalud.json` asuma repositooriumi juurkaustas.

Vajalikud Pythoni paketid tuleb vajadusel paigaldada käsuga:

```bash
pip install flask flask-cors stanza scipy statsmodels
```

Taustarakenduse saab käivitada repositooriumi juurkaustast käsuga:

```bash
python backend.py
```

Kui Stanza eestikeelne mudel puudub, laadib taustarakendus selle esmakordsel käivitamisel automaatselt alla.

### Kasutajaliides

Kasutajaliidese kaust on `sonaliigid/`.

```bash
cd sonaliigid
npm install
npm run dev
```

Kasutajaliides loeb taustarakenduse aadressi muutujast `VITE_API_URL`.

## Tüüpiline kohalik seadistus

1. Veendu, et `baas_osakaalud.json` on repositooriumi juurkaustas olemas.
2. Käivita taustarakendus käsuga `python backend.py`.
3. Käivita kasutajaliides kaustas `sonaliigid/` käsuga `npm run dev`.
4. Määra `VITE_API_URL` nii, et kasutajaliides saadaks päringud Flaski taustarakendusele.

## Märkused

- Võrdlusandmestikku selles repositooriumis ei genereerita; siin kasutatakse eraldi koostatud faili `baas_osakaalud.json`.
- Kui baasmaterjal uuesti genereeritakse, tuleks siin kasutada uuendatud faili `baas_osakaalud.json`.
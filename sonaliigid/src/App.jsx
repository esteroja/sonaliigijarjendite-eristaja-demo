import { useState } from "react";
import "./App.css";

import InputControls from "./components/input/InputControls.jsx";
import AnalysisInfoTooltip from "./components/shared/AnalysisInfoTooltip.jsx";
import SectionTabs from "./components/shared/SectionTabs.jsx";
import OverviewView from "./components/views/OverviewView.jsx";
import AtypicalView from "./components/views/AtypicalView.jsx";
import TreeView from "./components/views/TreeView.jsx";
import { useAnalysis } from "./hooks/useAnalysis.js";
import { useExamplesByKey } from "./hooks/useExamplesByKey.js";
import { useRowsByN } from "./hooks/useRowsByN.js";

const ANALYZE_ENDPOINT = import.meta.env.VITE_API_URL;

export default function App() {
  const {
    text,
    setText,
    alpha,
    setAlpha,
    isLoading,
    error,
    allExamples,
    atypicalExamples,
    summaryData,
    handleSubmit,
  } = useAnalysis(ANALYZE_ENDPOINT);

  const [selectedNs, setSelectedNs] = useState([2, 3, 4]);
  const [sort, setSort] = useState({ by: null, dir: "asc" });
  const [section, setSection] = useState("overview");

  const overviewRows = useRowsByN(summaryData);
  const getExamplesForKey = useExamplesByKey(allExamples);
  const getAtypicalExamplesForKey = useExamplesByKey(atypicalExamples);

  const hasSummaryData = !!summaryData;
  const hasData = (allExamples?.length ?? 0) > 0 || hasSummaryData;

  return (
    <div className="app-container">
      <h2 className="app-title">Sõnaliigijärjendite eristaja</h2>
      <div className="app-intro">
        <span className="app-intro-text">
          Tööriist võrdleb sisestatud teksti sõnaliikide järjestusi
          (sõnaliikide n-gramme) võrdluskorpuse sõnaliikide järjestustega ja
          aitab leida mustreid, mis on sisestatud tekstis ebatavaliselt
          sagedased või harvad.
          <br />
          Analüüs toimub lausete kaupa, osalauseid ei arvestata ja muu
          kirjavahemärgistus ei mõjuta tulemusi.
        </span>
        <AnalysisInfoTooltip />
      </div>

      <InputControls
        text={text}
        setText={setText}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />

      {error && <div className="error-banner">{error}</div>}

      <SectionTabs visible={hasData} section={section} setSection={setSection} />

      {section === "overview" && hasSummaryData && (
        <OverviewView
          rowsByN={overviewRows}
          selectedNs={selectedNs}
          setSelectedNs={setSelectedNs}
          sortBy={sort.by}
          sortDir={sort.dir}
          setSort={setSort}
          getExamplesForKey={getExamplesForKey}
        />
      )}

      {section === "atypical" && hasSummaryData && (
        <AtypicalView
          rowsByN={overviewRows}
          selectedNs={selectedNs}
          setSelectedNs={setSelectedNs}
          sortBy={sort.by}
          sortDir={sort.dir}
          setSort={setSort}
          getExamplesForKey={getAtypicalExamplesForKey}
          alpha={alpha}
          setAlpha={setAlpha}
          isLoading={isLoading}
        />
      )}

      {section === "tree" && hasSummaryData && (
        <TreeView
          rowsByN={overviewRows}
          selectedNs={selectedNs}
          setSelectedNs={setSelectedNs}
          getExamplesForKey={getExamplesForKey}
          alpha={alpha}
          setAlpha={setAlpha}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

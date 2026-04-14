export default function InputControls({
  text,
  setText,
  onSubmit,
  isLoading = false,
}) {

  return (
    <>
      <div className="controls">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          cols={60}
          placeholder="Sisesta tekst siia..."
          className="controls-textarea"
          disabled={isLoading}
        />
      </div>

      <button
        type="button"
        onClick={onSubmit}
        className="primary-button"
        disabled={isLoading}
      >
        {isLoading ? "Analüüsin..." : "Analüüsi"}
      </button>
    </>
  );
}

type Props = {
  selection: string;
  custom: string;
  error: string;
  setSelection: (value: string) => void;
  setCustom: (value: string) => void;
};
export default function TipPorcentageForm({
  selection,
  custom,
  error,
  setSelection,
  setCustom,
}: Props) {
  return (
    <fieldset>
      <legend>Propina</legend>
      <div className="tip-options">
        {["0", "10", "15", "20", "custom"].map((value) => (
          <label className="tip-option" key={value}>
            <input
              type="radio"
              name="tip"
              value={value}
              checked={selection === value}
              onChange={() => setSelection(value)}
            />
            <span>
              {value === "0"
                ? "Sin propina"
                : value === "custom"
                  ? "Personalizada"
                  : `${value}%`}
            </span>
          </label>
        ))}
      </div>
      {selection === "custom" && (
        <div className="custom-tip">
          <label htmlFor="custom-tip">Porcentaje personalizado (%)</label>
          <input
            id="custom-tip"
            inputMode="decimal"
            type="text"
            value={custom}
            onChange={(event) => setCustom(event.target.value)}
            aria-invalid={!!error}
            aria-describedby={error ? "tip-error" : "tip-hint"}
          />
          <p id="tip-hint" className="muted">
            De 0 a 100, con hasta dos decimales.
          </p>
          {error && (
            <p id="tip-error" className="error">
              {error}
            </p>
          )}
        </div>
      )}
    </fieldset>
  );
}

export default ({ quantity, onChange }) => {
  return (
    <>
      <div className="input-group mb-3" style={{ maxWidth: "120px" }}>
        <div className="input-group-prepend">
          <button
            className="btn btn-outline-primary js-btn-minus"
            type="button"
            onClick={(e) => onChange(Math.max(1, quantity - 1))}
          >
            &minus;
          </button>
        </div>
        <input
          type="text"
          className="form-control text-center"
          value={quantity}
          onChange={(e) => onChange(Number.parseInt(e.target.value))}
          placeholder=""
          aria-label="Example text with button addon"
          aria-describedby="button-addon1"
        />
        <div className="input-group-append">
          <button
            className="btn btn-outline-primary js-btn-plus"
            type="button"
            onClick={(e) => onChange(quantity + 1)}
          >
            +
          </button>
        </div>
      </div>
    </>
  );
};

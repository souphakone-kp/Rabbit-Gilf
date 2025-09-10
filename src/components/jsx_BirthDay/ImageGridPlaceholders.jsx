export default function ImageGridPlaceholders({ count = 6 }) {
  return (
    <div className="bd-placeholder-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bd-image-placeholder"
          data-label={`Photo ${i + 1}`}
          data-ratio="16/9"
        ></div>
      ))}
    </div>
  );
}

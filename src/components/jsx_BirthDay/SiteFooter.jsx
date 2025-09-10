export default function SiteFooter({ celebrant, fromName }) {
  return (
    <footer className="bd-footer">
      <div
        className="bd-container"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          padding: "0.9rem 1rem",
        }}
      >
        {/* +++ Personalized footer */}
        <div>
          Made with ❤️ by {fromName} for {celebrant}
        </div>
        <a href="#top">Back to top</a>
      </div>
    </footer>
  );
}

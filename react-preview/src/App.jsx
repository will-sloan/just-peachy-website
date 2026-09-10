import { useEffect, useState } from "react";

const base = import.meta.env.BASE_URL;

const assets = {
  wordmark: `${base}assets/just-peachy-wordmark.svg`,
  productConcept: `${base}assets/product-concept.png`,
  amir: `${base}assets/amir-laghai.jpg`,
  will: `${base}assets/will-sloan.jpg`,
};

const features = [
  {
    label: "Offline",
    text: "Speech stays on the tablet, with no internet connection required.",
  },
  {
    label: "Speaker labels",
    text: "Diarization and speaker embeddings keep conversations organized.",
  },
  {
    label: "Live captions",
    text: "Streaming speech models keep text moving in noisy spaces.",
  },
];

const transcript = [
  {
    id: "maya-knitting",
    speaker: "Maya",
    text: "I started knitting a scarf this week.",
  },
  {
    id: "theo-yarn",
    speaker: "Theo",
    text: "That is great. What color yarn did you choose?",
  },
  {
    id: "unknown-server",
    speaker: "Unknown 1",
    text: "Hi there, are you ready to order some food?",
  },
  {
    id: "maya-ordering",
    speaker: "Maya",
    text: "Yes, I'd like",
    current: true,
  },
];

const founders = [
  {
    name: "Amir Laghai",
    image: assets.amir,
    imageClass: "founder-photo-amir",
    bio:
      "Amir grew up in Toronto before moving to Ottawa to study Engineering Physics at Carleton University, where he also completed a minor in Physics. He stayed at Carleton for a master's in Biomedical Engineering with a specialization in Data Science. At the Sam3 AGE-WELL Lab, his work has focused on aging care, including research into non-invasive dementia detection.",
  },
  {
    name: "Will Sloan",
    image: assets.will,
    imageClass: "founder-photo-will",
    bio:
      "Will grew up in Ottawa and studied Computer Systems Engineering at Carleton University. He completed his master's in June 2026, with thesis work exploring how hearing aids can track human activity for at-home clinical assessments. Over four years with the Sam3 AGE-WELL Lab, he has worked across a range of health-focused engineering projects.",
  },
];

function getPageFromHash() {
  if (window.location.hash === "#about") {
    return "about";
  }

  if (window.location.hash === "#demo") {
    return "demo";
  }

  return "home";
}

function Header({ page }) {
  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label="Just Peachy home">
        <img src={assets.wordmark} alt="Just Peachy" />
      </a>

      <nav className="nav-links" aria-label="Primary navigation">
        <a href="#home" aria-current={page === "home" ? "page" : undefined}>
          Product
        </a>
        <a href="#demo" aria-current={page === "demo" ? "page" : undefined}>
          Demo
        </a>
        <a href="#about" aria-current={page === "about" ? "page" : undefined}>
          About
        </a>
      </nav>
    </header>
  );
}

function TabletDemo() {
  const [showOwnVoice, setShowOwnVoice] = useState(true);
  const [activeLineIndex, setActiveLineIndex] = useState(0);
  const [visibleCharacters, setVisibleCharacters] = useState(0);
  const visibleTranscript = transcript
    .slice(0, activeLineIndex + 1)
    .filter((line) => showOwnVoice || line.speaker !== "Theo");

  useEffect(() => {
    const activeLine = transcript[activeLineIndex];
    const hasFinishedLine = visibleCharacters >= activeLine.text.length;
    const hasFinishedPlayback =
      activeLineIndex === transcript.length - 1 && hasFinishedLine;
    const delay = hasFinishedPlayback ? 3000 : hasFinishedLine ? 650 : 55;
    const timer = window.setTimeout(() => {
      if (hasFinishedPlayback) {
        setActiveLineIndex(0);
        setVisibleCharacters(0);
        return;
      }

      if (hasFinishedLine) {
        setActiveLineIndex((currentIndex) => currentIndex + 1);
        setVisibleCharacters(0);
        return;
      }

      setVisibleCharacters((currentCount) => currentCount + 1);
    }, delay);

    return () => window.clearTimeout(timer);
  }, [activeLineIndex, visibleCharacters]);

  return (
    <div className="tablet" aria-label="A tablet showing live speaker-labelled captions">
      <div className="voice-control">
        <span id="own-voice-label">Toggle showing own voice</span>
        <button
          className="voice-toggle"
          type="button"
          aria-labelledby="own-voice-label"
          aria-pressed={showOwnVoice}
          onClick={() => setShowOwnVoice((current) => !current)}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <div className="tablet-topline">
        <span>Noise level: 24%</span>
        <span>Known Speakers: 2</span>
      </div>
      <div className="caption-stack" aria-live="polite">
        {visibleTranscript.map((line) => {
          const originalIndex = transcript.findIndex(
            (transcriptLine) => transcriptLine.id === line.id,
          );
          const isActiveLine = originalIndex === activeLineIndex;
          const visibleText = isActiveLine
            ? line.text.slice(0, visibleCharacters)
            : line.text;
          const shouldShowEllipsis =
            isActiveLine &&
            (visibleCharacters < line.text.length || line.current);

          return (
          <p
            className={`caption-line${isActiveLine ? " caption-current" : ""}`}
            key={line.id}
          >
            <b>{line.speaker}</b>
            <span>
              {visibleText}
              {shouldShowEllipsis ? (
                <>
                  {" "}
                  <span className="animated-ellipsis" aria-label="...">
                    <span aria-hidden="true">.</span>
                    <span aria-hidden="true">.</span>
                    <span aria-hidden="true">.</span>
                  </span>
                </>
              ) : null}
            </span>
          </p>
          );
        })}
      </div>
    </div>
  );
}

function Home() {
  return (
    <main className="site-main home-view">
      <section className="home-layout" aria-labelledby="product-title">
        <div className="home-copy">
          <p className="eyebrow">Offline speaker-labelled captions</p>
          <h1 id="product-title">Clear conversations in noisy places.</h1>
          <p className="lede">
            Just Peachy is a dedicated tablet for deaf and hard-of-hearing
            listeners. It transcribes speech in real time, labels each speaker,
            and keeps audio private on device.
          </p>

          <ul className="feature-points" aria-label="Product features">
            {features.map((feature) => (
              <li key={feature.label}>
                <strong>{feature.label}</strong>
                <span>{feature.text}</span>
              </li>
            ))}
          </ul>

          <div className="actions">
            <a
              className="primary-action"
              href="mailto:hello@justpeachy.co?subject=Pilot%20request"
            >
              Request a pilot
            </a>
          </div>
        </div>

        <div className="product-visual" aria-label="Just Peachy product concept">
          <img
            className="product-concept"
            src={assets.productConcept}
            alt="Concept rendering of the Just Peachy transcription tablet"
          />
        </div>
      </section>
    </main>
  );
}

function Demo() {
  return (
    <main className="site-main demo-view">
      <section className="demo-layout" aria-labelledby="demo-title">
        <div className="demo-copy">
          <p className="eyebrow">Live demo</p>
          <h1 id="demo-title">Speaker labels, in the moment.</h1>
          <p className="lede">
            A compact look at how Just Peachy separates known voices, keeps
            unknown speakers distinct, and lets Theo hide his own captions.
          </p>
        </div>
        <div className="product-visual">
          <TabletDemo />
        </div>
      </section>
    </main>
  );
}

function About() {
  return (
    <main className="site-main about-view" aria-labelledby="about-title">
      <h1 id="about-title" className="visually-hidden">
        About Amir Laghai and Will Sloan
      </h1>

      <section className="about-layout" aria-label="Founders">
        {founders.map((founder) => (
          <article className="founder-panel" key={founder.name}>
            <div className="founder-photo-wrap">
              <img
                className={`founder-photo ${founder.imageClass}`}
                src={founder.image}
                alt={founder.name}
              />
            </div>
            <div className="founder-copy">
              <p>Co-founder</p>
              <h2>{founder.name}</h2>
              <span>{founder.bio}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState(getPageFromHash);

  useEffect(() => {
    const updatePage = () => setPage(getPageFromHash());

    updatePage();
    window.addEventListener("hashchange", updatePage);

    return () => window.removeEventListener("hashchange", updatePage);
  }, []);

  return (
    <>
      <Header page={page} />
      {page === "about" ? <About /> : page === "demo" ? <Demo /> : <Home />}
    </>
  );
}

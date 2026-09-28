import React, { useEffect, useState } from 'react';
import { ArrowDownRight, ArrowLeft, ArrowRight, BarChart3, FileUp, GitCompareArrows, Lightbulb, MoveUpRight } from 'lucide-react';
import LogoF from './components/LogoF';
import dashboardPreview from '../../assets/dashboard_1.png';
import movingImage from './assets/moving average.png';
import arimaImage from './assets/arima.png';
import prophetImage from './assets/prophet.png';
import holtImage from './assets/holt winters.png';
import './Landing.css';

const models = [
  { number: '01', name: 'Moving Average', detail: 'A simple baseline that smooths recent changes.', image: movingImage },
  { number: '02', name: 'ARIMA', detail: 'A flexible choice for patterns without strong seasonality.', image: arimaImage },
  { number: '03', name: 'Prophet', detail: 'A flexible approach for changing trends and recurring patterns.', image: prophetImage },
  { number: '04', name: 'Holt–Winters', detail: 'Useful when both trend and seasonality matter.', image: holtImage },
];

export default function Landing({ onLoginClick }) {
  const [activeModel, setActiveModel] = useState(0);
  const [pauseModelRotation, setPauseModelRotation] = useState(false);

  useEffect(() => {
    if (pauseModelRotation || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActiveModel((current) => (current + 1) % models.length);
    }, 4800);
    return () => window.clearInterval(timer);
  }, [pauseModelRotation]);

  const showPreviousModel = () => setActiveModel((current) => (current + models.length - 1) % models.length);
  const showNextModel = () => setActiveModel((current) => (current + 1) % models.length);

  return (
    <main className="landing-page">
      <header className="site-header">
        <div className="site-header-inner">
          <a className="brand" href="#top" aria-label="SmartForecast home">
            <LogoF className="brand-logo" />
            <span>SmartForecast AI</span>
          </a>
          <nav className="site-nav" aria-label="Main navigation">
            <a href="#approach">The approach</a>
            <a href="#workflow">How it works</a>
          </nav>
          <button className="header-cta" onClick={onLoginClick}>
            Sign in <MoveUpRight size={15} />
          </button>
        </div>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-inner">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-line" /> Time-series forecasting</div>
            <h1>A clearer view of <em>what comes next.</em></h1>
            <p className="hero-description">
              Bring in your historical data, compare four forecasting methods, and export a forecast your team can inspect.
            </p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={onLoginClick}>
                Open the workspace <ArrowRight size={17} />
              </button>
              <a className="text-cta" href="#workflow">See how it works <ArrowDownRight size={16} /></a>
            </div>
            <div className="hero-note"><BarChart3 size={14} /> Start with a CSV. Keep the forecast and its context together.</div>
          </div>

          <div className="preview-column" aria-label="A preview of the SmartForecast dashboard">
            <div className="preview-caption">
              <span><span className="status-dot" /> Workspace preview</span>
              <span>Forecast view · sample data</span>
            </div>
            <div className="preview-window">
              <div className="preview-chrome" aria-hidden="true">
                <span /><span /><span />
                <div className="preview-address">smartforecast / workspace</div>
              </div>
              <img src={dashboardPreview} alt="SmartForecast workspace showing a forecast chart, model selection, and result metrics" />
            </div>
            <div className="preview-footnote"><span>01</span> Historical values meet the forecast horizon <span className="footnote-rule" /></div>
          </div>
        </div>
        <div className="hero-bottomline"><span>For practical planning work</span><span>Sales · Demand · Operations · Finance</span></div>
      </section>

      <section className="approach-section" id="approach">
        <div className="section-heading">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> Forecasting methods</div>
            <h2>Compare four models<br />on your own data.</h2>
          </div>
          <p>Each method reads a time series differently. Select a model to review its forecast, then use the validation metrics to decide which fits your data.</p>
        </div>
        <div className="model-showcase" onMouseEnter={() => setPauseModelRotation(true)} onMouseLeave={() => setPauseModelRotation(false)}>
          <div className="model-picker" role="tablist" aria-label="Choose a forecasting model">
            {models.map((model, index) => (
              <button
                className={`model-option${activeModel === index ? ' is-active' : ''}`}
                key={model.name}
                onClick={() => setActiveModel(index)}
                role="tab"
                aria-selected={activeModel === index}
              >
                <span className="model-number">{model.number}</span>
                <span className="model-option-copy"><strong>{model.name}</strong><small>{model.detail}</small></span>
                <ArrowRight className="model-option-arrow" size={16} />
              </button>
            ))}
            <p className="model-rotation-note"><span className="rotation-dot" /> Preview changes every few seconds · select any model to inspect it</p>
          </div>
          <div className="model-stage" role="tabpanel" aria-live="polite">
            <div className="model-stage-copy">
              <span className="model-stage-kicker">MODEL {models[activeModel].number} / 04</span>
              <p>{models[activeModel].detail}</p>
            </div>
            <div className="model-art-frame">
              <img
                key={models[activeModel].name}
                className="model-art-image"
                src={models[activeModel].image}
                alt={`${models[activeModel].name} forecast and model overview`}
                loading="lazy"
              />
            </div>
            <div className="model-stage-controls">
              <button aria-label="Previous model" onClick={showPreviousModel}><ArrowLeft size={16} /></button>
              <div className="model-dots" aria-label={`Model ${activeModel + 1} of 4`}>
                {models.map((model, index) => <button key={model.name} aria-label={`Show ${model.name}`} aria-pressed={activeModel === index} onClick={() => setActiveModel(index)} />)}
              </div>
              <button aria-label="Next model" onClick={showNextModel}><ArrowRight size={16} /></button>
            </div>
          </div>
        </div>
        <div className="comparison-note">
          <GitCompareArrows size={18} />
          <p><strong>Compare before you commit.</strong> Review MAE, RMSE, and MAPE for your own data, then choose the model that best fits the decision.</p>
        </div>
      </section>

      <section className="workflow-section" id="workflow">
        <div className="workflow-intro">
          <div className="eyebrow"><span className="eyebrow-line" /> From file to forecast</div>
          <h2>A useful answer,<br />without the setup.</h2>
          <p>Bring a simple CSV. Leave with a forecast and a report your team can use.</p>
          <button className="inline-cta" onClick={onLoginClick}>Go to the workspace <MoveUpRight size={16} /></button>
        </div>
        <div className="workflow-steps">
          <article className="workflow-step">
            <span className="step-icon"><FileUp size={19} /></span>
            <div><span className="step-kicker">First, bring your history</span><h3>Upload a CSV</h3><p>Use a date column and a numeric value column. Your series is plotted as soon as it’s loaded.</p></div>
            <span className="step-index">01</span>
          </article>
          <article className="workflow-step">
            <span className="step-icon"><GitCompareArrows size={19} /></span>
            <div><span className="step-kicker">Then, test the shape</span><h3>Forecast and compare</h3><p>Run a model, set the horizon, and compare all four approaches using familiar error metrics.</p></div>
            <span className="step-index">02</span>
          </article>
          <article className="workflow-step">
            <span className="step-icon"><Lightbulb size={19} /></span>
            <div><span className="step-kicker">Finally, make it useful</span><h3>Explain and export</h3><p>Get an AI-written readout of the forecast, then download a PDF report or CSV.</p></div>
            <span className="step-index">03</span>
          </article>
        </div>
      </section>

      <section className="closing-section">
        <div className="closing-index">SMARTFORECAST / 01</div>
        <div className="closing-copy"><h2>Start with the data<br />you already have.</h2><p>A straightforward way to see what your numbers might do next.</p></div>
        <button className="closing-cta" onClick={onLoginClick}>Enter SmartForecast <ArrowRight size={18} /></button>
      </section>

      <footer className="site-footer">
        <a className="brand footer-brand" href="#top"><LogoF className="brand-logo" /><span>SmartForecast AI</span></a>
        <span>Forecasts are decision support. Your data and context come first.</span>
        <a href="#top" className="back-to-top">Back to top ↑</a>
      </footer>
    </main>
  );
}

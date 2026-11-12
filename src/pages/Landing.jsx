import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Camera, ScanSearch, Gift } from 'lucide-react';
import Header from '../components/Header.jsx';

const STEPS = [
  { icon: Camera, title: 'Photograph your bottle', text: 'Any Lux shower gel or body wash, label facing the camera.' },
  { icon: ScanSearch, title: 'We check it in seconds', text: 'Our AI reads the pack and confirms it is Lux.' },
  { icon: Gift, title: 'Scratch to reveal', text: 'Rub away the gold foil to see what you won.' },
];

const PRIZES = ['20% off your next bottle', 'Buy one, get one', 'Lux gift sets', 'Spa days for two'];

const ease = [0.22, 1, 0.36, 1];

export default function Landing() {
  return (
    <div className="landing">
      <Header />

      <main>
        <section className="hero">
          <div className="hero__copy">
            <motion.h1
              className="hero__title"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease }}
            >
              Scan your Lux.
              <br />
              Win something lovely.
            </motion.h1>
            <motion.p
              className="hero__lede"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35, duration: 0.8 }}
            >
              Take a photo of your Lux shower gel. Once we recognise it, you scratch a gold card and keep the prize underneath.
            </motion.p>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55, duration: 0.8 }}>
              <Link to="/scan" className="btn btn--gold btn--lg">
                <Camera size={20} aria-hidden="true" />
                Get started
              </Link>
              <p className="hero__note">Takes about 30 seconds. No sign-up needed.</p>
            </motion.div>
          </div>

          <div className="hero__visual" aria-hidden="true">
            <motion.div
              className="arch"
              initial={{ clipPath: 'inset(100% 0 0 0 round 999px 999px 32px 32px)' }}
              animate={{ clipPath: 'inset(0% 0 0 0 round 999px 999px 32px 32px)' }}
              transition={{ duration: 1.1, ease }}
            >
              {Array.from({ length: 9 }).map((_, i) => (
                <span
                  key={i}
                  className="bubble"
                  style={{ '--x': `${8 + ((i * 37) % 84)}%`, '--s': `${10 + ((i * 7) % 22)}px`, '--d': `${i * 0.9}s` }}
                />
              ))}
              <motion.div
                className="arch__bottle"
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4, duration: 1.1, ease }}
              >
                <LuxBottle />
              </motion.div>
            </motion.div>
          </div>
        </section>

        <section className="steps" aria-labelledby="steps-title">
          <h2 id="steps-title" className="section-title">How it works</h2>
          <ol className="steps__list">
            {STEPS.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="step">
                <span className="step__num">{i + 1}</span>
                <Icon className="step__icon" size={22} aria-hidden="true" />
                <h3>{title}</h3>
                <p>{text}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="prizes" aria-labelledby="prizes-title">
          <h2 id="prizes-title" className="section-title">Up for grabs</h2>
          <ul className="prizes__list">
            {PRIZES.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>Proof of concept for Unilever. Prizes and codes shown are for demonstration only.</p>
      </footer>
    </div>
  );
}

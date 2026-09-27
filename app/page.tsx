"use client";

import { useMemo, useState } from "react";
import Image from "next/image";

type Dish = {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  tag?: string;
};

const dishes: Dish[] = [
  { id: 1, name: "Truffle Burrata", description: "Creamy burrata, black truffle, heirloom tomatoes, basil oil.", price: 18, category: "Starters", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=85", tag: "Signature" },
  { id: 2, name: "Wagyu Carpaccio", description: "Thin-sliced wagyu, parmesan, capers, smoked olive oil.", price: 24, category: "Starters", image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=85" },
  { id: 3, name: "Miso Salmon", description: "Miso-glazed salmon, charred broccolini, sesame ponzu.", price: 29, category: "Mains", image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=85", tag: "Popular" },
  { id: 4, name: "Black Garlic Rigatoni", description: "Fresh rigatoni, black garlic cream, wild mushrooms, pecorino.", price: 22, category: "Mains", image: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85" },
  { id: 5, name: "Dry-Aged Ribeye", description: "300g dry-aged beef, smoked butter, roasted shallots, jus.", price: 42, category: "Mains", image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", tag: "Chef's pick" },
  { id: 6, name: "Crispy Potatoes", description: "Confit potatoes, rosemary salt, parmesan cream.", price: 11, category: "Sides", image: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=85" },
  { id: 7, name: "Dark Chocolate Torte", description: "70% dark chocolate, sea salt, vanilla mascarpone.", price: 14, category: "Desserts", image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85", tag: "New" },
  { id: 8, name: "Yuzu Cloud", description: "Yuzu curd, coconut mousse, sesame crumble, citrus gel.", price: 13, category: "Desserts", image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85" },
];

const categories = ["All", "Starters", "Mains", "Sides", "Desserts"];

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const filtered = useMemo(() => dishes.filter((dish) => {
    const categoryMatch = activeCategory === "All" || dish.category === activeCategory;
    const queryMatch = [dish.name, dish.description, dish.category].join(" ").toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [activeCategory, query]);

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="NOIR home">
          <span className="brand-mark">N</span>
          <span>NOIR</span>
        </a>
        <div className="nav-links">
          <a href="#menu">Menu</a>
          <a href="#story">Our story</a>
          <a href="#visit">Visit</a>
        </div>
        <a className="nav-cta" href="#visit">Reserve a table <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> Contemporary dining · Baku</div>
          <h1>Good food.<br /><em>Dark mood.</em></h1>
          <p>A modern kitchen built around bold flavors, seasonal ingredients and the kind of nights you remember.</p>
          <div className="hero-actions">
            <a className="button primary" href="#menu">Explore the menu <span>↓</span></a>
            <a className="button ghost" href="#visit">Find us</a>
          </div>
        </div>
        <div className="hero-card">
          <Image src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90" alt="Elegant restaurant table" fill priority sizes="(max-width: 800px) 100vw, 45vw" />
          <div className="hero-card-overlay" />
          <div className="hero-card-label">
            <span>Tonight</span>
            <strong>Seasonal tasting</strong>
            <small>7 courses · 95 AZN</small>
          </div>
        </div>
        <div className="scroll-note">SCROLL TO DISCOVER <span>↓</span></div>
      </section>

      <section className="marquee" aria-label="Restaurant highlights">
        <span>SEASONAL INGREDIENTS</span><i>✦</i><span>OPEN KITCHEN</span><i>✦</i><span>CRAFTED COCKTAILS</span><i>✦</i><span>LOCAL PRODUCERS</span><i>✦</i><span>SEASONAL INGREDIENTS</span>
      </section>

      <section className="menu-section" id="menu">
        <div className="section-head">
          <div>
            <div className="eyebrow"><span /> The menu</div>
            <h2>Made to <em>linger.</em></h2>
          </div>
          <p>Small plates for the table. Big flavors for the memory. Our menu changes with the season.</p>
        </div>

        <div className="toolbar">
          <div className="categories">
            {categories.map((category) => (
              <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>
                {category}
              </button>
            ))}
          </div>
          <label className="search">
            <span>⌕</span>
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes..." aria-label="Search dishes" />
          </label>
        </div>

        <div className="dish-grid">
          {filtered.map((dish) => (
            <article className="dish-card" key={dish.id} onClick={() => setSelectedDish(dish)}>
              <div className="dish-image">
                <Image src={dish.image} alt={dish.name} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <div className="image-shade" />
                {dish.tag && <span className="dish-tag">{dish.tag}</span>}
                <span className="view-arrow">↗</span>
              </div>
              <div className="dish-info">
                <div>
                  <h3>{dish.name}</h3>
                  <p>{dish.description}</p>
                </div>
                <strong>{dish.price} <small>AZN</small></strong>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && <div className="empty">Nothing matched that search. Try another dish.</div>}
      </section>

      <section className="story" id="story">
        <div className="story-image">
          <Image src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90" alt="Chef preparing a dish" fill sizes="(max-width: 800px) 100vw, 50vw" />
        </div>
        <div className="story-copy">
          <div className="eyebrow"><span /> Our philosophy</div>
          <h2>Less noise.<br /><em>More flavor.</em></h2>
          <p>NOIR is a place for people who care about what is on the plate — and who they share it with. We keep the room intimate, the ingredients honest and the cooking unapologetically bold.</p>
          <div className="stats">
            <div><strong>2019</strong><span>Founded</span></div>
            <div><strong>32</strong><span>Seats</span></div>
            <div><strong>∞</strong><span>Good nights</span></div>
          </div>
        </div>
      </section>

      <section className="visit" id="visit">
        <div>
          <div className="eyebrow"><span /> Come by</div>
          <h2>Your table<br /><em>is waiting.</em></h2>
        </div>
        <div className="visit-details">
          <div><span>ADDRESS</span><strong>12 Nizami Street<br />Baku, Azerbaijan</strong></div>
          <div><span>HOURS</span><strong>Mon–Thu · 18:00–00:00<br />Fri–Sun · 18:00–01:00</strong></div>
          <a className="button primary" href="tel:+994501234567">Call for a reservation <span>↗</span></a>
        </div>
      </section>

      <footer>
        <div className="brand"><span className="brand-mark">N</span><span>NOIR</span></div>
        <p>Contemporary dining in the heart of Baku.</p>
        <span>© 2026 NOIR</span>
      </footer>

      {selectedDish && (
        <div className="modal-backdrop" onClick={() => setSelectedDish(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDish(null)} aria-label="Close">×</button>
            <div className="modal-image"><Image src={selectedDish.image} alt={selectedDish.name} fill sizes="(max-width: 700px) 100vw, 600px" /></div>
            <div className="modal-content">
              <span className="modal-category">{selectedDish.category}</span>
              <h2>{selectedDish.name}</h2>
              <p>{selectedDish.description}</p>
              <strong>{selectedDish.price} <small>AZN</small></strong>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
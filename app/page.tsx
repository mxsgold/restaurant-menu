"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "../lib/supabase";

type Dish = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image_path: string | null;
  available: boolean;
  sort_order: number;
  tag?: string;
};

const demoDishes: Dish[] = [
  { id: "demo-1", name: "Truffle Burrata", description: "Creamy burrata, black truffle, heirloom tomatoes, basil oil.", price: 18, category: "Starters", image_path: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 1, tag: "Signature" },
  { id: "demo-2", name: "Wagyu Carpaccio", description: "Thin-sliced wagyu, parmesan, capers, smoked olive oil.", price: 24, category: "Starters", image_path: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 2 },
  { id: "demo-3", name: "Miso Salmon", description: "Miso-glazed salmon, charred broccolini, sesame ponzu.", price: 29, category: "Mains", image_path: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 3, tag: "Popular" },
  { id: "demo-4", name: "Black Garlic Rigatoni", description: "Fresh rigatoni, black garlic cream, wild mushrooms, pecorino.", price: 22, category: "Mains", image_path: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 4 },
  { id: "demo-5", name: "Dry-Aged Ribeye", description: "300g dry-aged beef, smoked butter, roasted shallots, jus.", price: 42, category: "Mains", image_path: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 5, tag: "Chef's pick" },
  { id: "demo-6", name: "Crispy Potatoes", description: "Confit potatoes, rosemary salt, parmesan cream.", price: 11, category: "Sides", image_path: "https://images.unsplash.com/photo-1518013431117-eb1465fa5752?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 6 },
  { id: "demo-7", name: "Dark Chocolate Torte", description: "70% dark chocolate, sea salt, vanilla mascarpone.", price: 14, category: "Desserts", image_path: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 7, tag: "New" },
  { id: "demo-8", name: "Yuzu Cloud", description: "Yuzu curd, coconut mousse, sesame crumble, citrus gel.", price: 13, category: "Desserts", image_path: "https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=1200&q=85", available: true, sort_order: 8 },
];

const categories = ["All", "Starters", "Mains", "Sides", "Desserts"];

function resolveImage(path: string | null) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return supabase.storage.from("dish-images").getPublicUrl(path).data.publicUrl;
}

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);
  const [dishes, setDishes] = useState<Dish[]>(demoDishes);
  const [visibleDishIds, setVisibleDishIds] = useState<Set<string>>(new Set());
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    let mounted = true;

    async function loadMenu() {
      const { data } = await supabase
        .from("dishes")
        .select("id,name,description,price,category,image_path,available,sort_order")
        .eq("available", true)
        .eq("restaurant_slug", "noir")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (mounted && data && data.length > 0) setDishes(data as Dish[]);
    }

    loadMenu();
    const channel = supabase
      .channel("public-menu")
      .on("postgres_changes", { event: "*", schema: "public", table: "dishes" }, loadMenu)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => dishes.filter((dish) => {
    const categoryMatch = activeCategory === "All" || dish.category === activeCategory;
    const queryMatch = [dish.name, dish.description, dish.category].join(" ").toLowerCase().includes(query.toLowerCase());
    return categoryMatch && queryMatch;
  }), [dishes, activeCategory, query]);

  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setMenuVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(menu);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    setVisibleDishIds(new Set());
    const cards = Array.from(document.querySelectorAll<HTMLElement>(".dish-card"));
    if (!cards.length) return;
    const observer = new IntersectionObserver((entries) => {
      setVisibleDishIds((current) => {
        const next = new Set(current);
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute("data-dish-id");
            if (id) next.add(id);
          }
        });
        return next;
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -50px 0px" });
    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [filtered]);

  return (
    <main>
      <nav className="nav">
        <a className="brand" href="#top" aria-label="NOEL BABA RESTORAN home"><span className="brand-mark">N</span><span>NOEL BABA RESTORAN</span></a>
        <div className="nav-links"><a href="#menu">Menu</a><a href="#story">Our story</a><a href="#visit">Visit</a></div>
        <a className="nav-cta" href="https://wa.me/27634616022" target="_blank" rel="noreferrer">WhatsApp <span>↗</span></a>
      </nav>

      <section className="hero" id="top">
        <div className="hero-glow" />
        <div className="hero-copy">
          <div className="eyebrow"><span /> Contemporary dining · Baku</div>
          <h1>Good food.<br /><em>Dark mood.</em></h1>
          <p>A modern kitchen built around bold flavors, seasonal ingredients and the kind of nights you remember.</p>
          <div className="hero-actions"><a className="button primary" href="#menu">Explore the menu <span>↓</span></a><a className="button ghost" href="#visit">Find us</a></div>
        </div>
        <div className="hero-card">
          <Image src="https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=1400&q=90" alt="Elegant restaurant table" fill priority sizes="(max-width: 800px) 100vw, 45vw" />
          <div className="hero-card-overlay" />
          <div className="hero-card-label"><span>Tonight</span><strong>Seasonal tasting</strong><small>7 courses · 95 AZN</small></div>
        </div>
        <div className="scroll-note">SCROLL TO DISCOVER <span>↓</span></div>
      </section>

      <section className="marquee" aria-label="Restaurant highlights"><span>SEASONAL INGREDIENTS</span><i>✦</i><span>OPEN KITCHEN</span><i>✦</i><span>CRAFTED COCKTAILS</span><i>✦</i><span>LOCAL PRODUCERS</span><i>✦</i><span>SEASONAL INGREDIENTS</span></section>

      <section ref={menuRef} className={menuVisible ? "menu-section menu-visible" : "menu-section"} id="menu">
        <div className="section-head">
          <div><div className="eyebrow"><span /> The menu</div><h2>Made to <em>linger.</em></h2></div>
          <p>Small plates for the table. Big flavors for the memory. Our menu changes with the season.</p>
        </div>

        <div className="toolbar">
          <div className="categories">{categories.map((category) => <button key={category} className={activeCategory === category ? "category active" : "category"} onClick={() => setActiveCategory(category)}>{category}</button>)}</div>
          <label className="search"><span>⌕</span><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search dishes..." aria-label="Search dishes" /></label>
        </div>

        <div className="dish-grid">
          {filtered.map((dish) => (
            <article
              className={"dish-card " + (visibleDishIds.has(dish.id) ? "is-visible " : "") + (filtered.indexOf(dish) % 2 === 0 ? "reveal-left" : "reveal-right")}
              data-dish-id={dish.id}
              style={{ animationDelay: ((filtered.indexOf(dish) % 3) * 90) + "ms" }}
              key={dish.id}
              onClick={() => setSelectedDish(dish)}
            >
              <div className="dish-image">
                <Image src={resolveImage(dish.image_path)} alt={dish.name} fill sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw" />
                <div className="image-shade" />
                {dish.tag && <span className="dish-tag">{dish.tag}</span>}
                <span className="view-arrow">↗</span>
              </div>
              <div className="dish-info"><div><h3>{dish.name}</h3><p>{dish.description}</p></div><strong>{Number(dish.price).toFixed(0)} <small>AZN</small></strong></div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && <div className="empty">Nothing matched that search. Try another dish.</div>}
      </section>

      <section className="story" id="story">
        <div className="story-image"><Image src="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=90" alt="Chef preparing a dish" fill sizes="(max-width: 800px) 100vw, 50vw" /></div>
        <div className="story-copy"><div className="eyebrow"><span /> Our philosophy</div><h2>Less noise.<br /><em>More flavor.</em></h2><p>NOEL BABA RESTORAN is a place for people who care about what is on the plate — and who they share it with. We keep the room intimate, the ingredients honest and the cooking unapologetically bold.</p><div className="stats"><div><strong>2019</strong><span>Founded</span></div><div><strong>32</strong><span>Seats</span></div><div><strong>∞</strong><span>Good nights</span></div></div></div>
      </section>

      <section className="visit" id="visit">
        <div><div className="eyebrow"><span /> Come by</div><h2>Your table<br /><em>is waiting.</em></h2></div>
        <div className="visit-details"><div><span>ADDRESS</span><strong>12 Nizami Street<br />Baku, Azerbaijan</strong></div><div><span>HOURS</span><strong>Mon–Thu · 18:00–00:00<br />Fri–Sun · 18:00–01:00</strong></div><a className="button primary" href="https://wa.me/27634616022" target="_blank" rel="noreferrer">Позвонить хуесосу <span>↗</span></a></div>
      </section>

      <footer><div className="brand"><span className="brand-mark">N</span><span>NOEL BABA RESTORAN</span></div><p>Contemporary dining in the heart of Baku.</p><span>© 2026 NOEL BABA RESTORAN</span></footer>

      {selectedDish && (
        <div className="modal-backdrop" onClick={() => setSelectedDish(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDish(null)} aria-label="Close">×</button>
            <div className="modal-image"><Image src={resolveImage(selectedDish.image_path)} alt={selectedDish.name} fill sizes="(max-width: 700px) 100vw, 600px" /></div>
            <div className="modal-content"><span className="modal-category">{selectedDish.category}</span><h2>{selectedDish.name}</h2><p>{selectedDish.description}</p><strong>{Number(selectedDish.price).toFixed(0)} <small>AZN</small></strong></div>
          </div>
        </div>
      )}
    </main>
  );
}

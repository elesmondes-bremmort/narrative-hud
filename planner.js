let plannerApp = null;

const demoPool = [
  { id: "alaric", label: "A", name: "Alaric", type: "player" },
  { id: "kaelyss", label: "K", name: "Kaelyss", type: "player" },
  { id: "torvek", label: "T", name: "Torvek", type: "player" },
  { id: "bandit-1", label: "B1", name: "Bandit 1", type: "npc" },
  { id: "bandit-2", label: "B2", name: "Bandit 2", type: "npc" },
  { id: "ogre", label: "OG", name: "Ogre", type: "npc" },
  { id: "player-slot", label: "J", name: "Slot Joueur", type: "slot" }
];

const demoTimeline = [
  { id: "slot-1", label: "J", name: "Slot Joueur", type: "slot" },
  { id: "bandit-1", label: "B1", name: "Bandit 1", type: "npc" },
  { id: "slot-2", label: "J", name: "Slot Joueur", type: "slot" },
  { id: "bandit-2", label: "B2", name: "Bandit 2", type: "npc" },
  { id: "ogre", label: "OG", name: "Ogre", type: "npc" }
];

class PlannerNarratifApp extends Application {
  static get defaultOptions() {
    const saved = game.settings.get("planner-narratif", "windowState") ?? {};

    return foundry.utils.mergeObject(super.defaultOptions, {
      id: "planner-narratif-window",
      title: "Planner Narratif",
      width: saved.width ?? 720,
      height: saved.height ?? 260,
      top: saved.top ?? 120,
      left: saved.left ?? 320,
      resizable: true
    });
  }

  async _renderInner() {
    return $(`
      <section class="planner-shell">
        <header class="planner-header">
          <strong>Planner Narratif</strong>
          <span>V0.10</span>
        </header>

        <main class="planner-body">
          <section class="planner-section">
            <h3>POOL</h3>
            <div class="planner-pool">
              ${demoPool.map(item => this._renderChip(item, "pool")).join("")}
            </div>
          </section>

          <section class="planner-section">
            <h3>TIMELINE</h3>
            <div class="planner-timeline">
              ${demoTimeline.map(item => this._renderChip(item, "timeline")).join("")}
            </div>
          </section>
        </main>
      </section>
    `);
  }

  _renderChip(item, zone) {
    return `
      <button
        class="planner-chip planner-chip-${item.type} planner-chip-${zone}"
        title="${item.name}"
        type="button"
      >
        ${item.label}
      </button>
    `;
  }

  async close(options = {}) {
    const el = this.element?.[0];

    if (el) {
      await game.settings.set("planner-narratif", "windowState", {
        left: el.offsetLeft,
        top: el.offsetTop,
        width: el.offsetWidth,
        height: el.offsetHeight
      });
    }

    plannerApp = null;
    return super.close(options);
  }
}

Hooks.once("init", () => {
  game.settings.register("planner-narratif", "launcherPosition", {
    scope: "client",
    config: false,
    type: Object,
    default: {
      left: "432px",
      top: "851px"
    }
  });

  game.settings.register("planner-narratif", "windowState", {
    scope: "client",
    config: false,
    type: Object,
    default: {
      left: 320,
      top: 120,
      width: 720,
      height: 260
    }
  });
});

Hooks.once("ready", () => {
  ui.notifications.info("Planner Narratif chargé !");
  console.log("Planner Narratif | Ready V0.10");

  document.getElementById("planner-narratif-launcher")?.remove();

  const button = document.createElement("button");
  button.id = "planner-narratif-launcher";
  button.title = "Planner Narratif";
  button.innerText = "⚔";

  const savedPosition = game.settings.get("planner-narratif", "launcherPosition");

  button.style.left = savedPosition?.left ?? "432px";
  button.style.top = savedPosition?.top ?? "851px";

  let isDragging = false;
  let hasMoved = false;
  let offsetX = 0;
  let offsetY = 0;

  button.addEventListener("mousedown", event => {
    isDragging = true;
    hasMoved = false;

    offsetX = event.clientX - button.offsetLeft;
    offsetY = event.clientY - button.offsetTop;

    button.classList.add("dragging");
  });

  document.addEventListener("mousemove", event => {
    if (!isDragging) return;

    hasMoved = true;
    button.style.left = `${event.clientX - offsetX}px`;
    button.style.top = `${event.clientY - offsetY}px`;
  });

  document.addEventListener("mouseup", async () => {
    if (!isDragging) return;

    isDragging = false;
    button.classList.remove("dragging");

    await game.settings.set("planner-narratif", "launcherPosition", {
      left: button.style.left,
      top: button.style.top
    });
  });

  button.addEventListener("dblclick", event => {
    event.preventDefault();
    event.stopPropagation();

    if (hasMoved) return;

    if (plannerApp?.rendered) {
      plannerApp.close();
      return;
    }

    plannerApp = new PlannerNarratifApp();
    plannerApp.render(true);
  });

  document.body.appendChild(button);
});
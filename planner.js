Hooks.once("ready", () => {
  ui.notifications.info("Planner Narratif chargé !");
  console.log("Planner Narratif | Ready");

  const button = document.createElement("button");
  button.id = "planner-narratif-launcher";
  button.innerText = "⚔ Planner";
  button.onclick = () => {
    new Dialog({
      title: "Planner Narratif",
      content: `
        <div class="planner-narratif-content">
          <h2>Hello Ravessandre !</h2>
          <p>Le Planner Narratif est vivant.</p>
        </div>
      `,
      buttons: {
        close: {
          label: "Fermer"
        }
      }
    }).render(true);
  };

  document.body.appendChild(button);
});
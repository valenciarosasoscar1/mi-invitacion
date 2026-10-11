
document.addEventListener("DOMContentLoaded", () => {
    // Elementos principales
    const steps = document.querySelectorAll(".step");
    const dots = document.querySelectorAll(".dot");

    const startBtn = document.getElementById("startBtn");
    const yesBtn = document.getElementById("yesBtn");
    const noBtn = document.getElementById("noBtn");
    const noToast = document.getElementById("noToast");
    const buttonArea = document.getElementById("buttonArea");

    const choices = document.querySelectorAll(".choice");
    const toDateBtn = document.getElementById("toDateBtn");
    const dateInput = document.getElementById("dateInput");
    const timeButtons = document.querySelectorAll(".time");
    const confirmBtn = document.getElementById("confirmBtn");

    const summary = document.getElementById("summary");
    const envelope = document.getElementById("envelope");
    const secret = document.getElementById("secret");
    const envelopeHint = document.getElementById("envelopeHint");
    const againBtn = document.getElementById("againBtn");

    // Estado de la invitación
    let selectedKind = "";
    let selectedEmoji = "";
    let selectedTime = "";
    let noAttempts = 0;

    const noMessages = [
        "¿Segura? 🥺",
        "Ochochientos si lo oprimes 🐵",
        "Piénsalo otra vez 🙃",
        "Uy, casi…",
        "El destino dice que no 👀",
        "Bueno, mira qué bonito está el SÍ 💖"
    ];

    // Cambiar de pantalla
    function showStep(number) {
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === number);
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle("active", index <= Math.min(number, 3));
        });

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    startBtn.addEventListener("click", () => showStep(1));

    yesBtn.addEventListener("click", () => showStep(2));

    // El botón NO intenta escapar
    function dodgeNoButton() {
        noAttempts++;

        noToast.textContent =
            noMessages[Math.min(noAttempts - 1, noMessages.length - 1)];

        const maxX = Math.max(
            25,
            Math.min(100, buttonArea.clientWidth / 2 - 50)
        );

        const x = (Math.random() < 0.5 ? -1 : 1) *
            (25 + Math.random() * maxX);

        const y = Math.random() < 0.5 ? -12 : 12;
        const rotation = Math.random() * 12 - 6;

        noBtn.style.transform =
            `translate(${x}px, ${y}px) rotate(${rotation}deg)`;

        if (noAttempts >= 4) {
            noBtn.textContent = "¿Y si mejor SÍ? 😳";
        }
    }

    noBtn.addEventListener("pointerenter", (event) => {
        if (event.pointerType === "mouse") {
            dodgeNoButton();
        }
    });

    noBtn.addEventListener("click", (event) => {
        event.preventDefault();
        dodgeNoButton();
    });

    // En pantallas táctiles, intentar tocar NO lo mueve.
    noBtn.addEventListener("touchstart", (event) => {
        event.preventDefault();
        dodgeNoButton();
    }, { passive: false });

    // Seleccionar una actividad
    choices.forEach((button) => {
        button.addEventListener("click", () => {
            choices.forEach((choice) => {
                choice.classList.remove("selected");
            });

            button.classList.add("selected");

            selectedKind = button.dataset.kind;
            selectedEmoji = button.dataset.emoji;

            toDateBtn.disabled = false;
        });
    });

    // Obtener la fecha local en formato YYYY-MM-DD
    function getLocalDate() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    dateInput.min = getLocalDate();

    toDateBtn.addEventListener("click", () => {
        dateInput.min = getLocalDate();

        if (dateInput.value && dateInput.value < dateInput.min) {
            dateInput.value = "";
        }

        showStep(3);
        updateConfirmButton();
    });

    // Seleccionar fecha
    dateInput.addEventListener("change", updateConfirmButton);

    // Seleccionar hora
    timeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            timeButtons.forEach((time) => {
                time.classList.remove("selected");
            });

            button.classList.add("selected");
            selectedTime = button.dataset.time;

            updateConfirmButton();
        });
    });

    // Validar fecha y hora
    function updateConfirmButton() {
        const validDate =
            dateInput.value !== "" &&
            dateInput.value >= getLocalDate();

        confirmBtn.disabled = !(validDate && selectedTime);
    }

    // Botones para regresar
    document.querySelectorAll("[data-back]").forEach((button) => {
        button.addEventListener("click", () => {
            showStep(Number(button.dataset.back));
        });
    });

    // Formatear la fecha en español
    function formatDate(value) {
        const [year, month, day] = value.split("-").map(Number);

        return new Date(year, month - 1, day).toLocaleDateString("es-MX", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        });
    }

    // Confirmar la cita
    confirmBtn.addEventListener("click", () => {
        updateConfirmButton();

        if (confirmBtn.disabled) {
            return;
        }

        // Construir el resumen sin insertar texto como HTML.
        summary.replaceChildren();

        const details = [
            [selectedEmoji, "Plan:", selectedKind],
            ["📅", "Fecha:", formatDate(dateInput.value)],
            ["🕒", "Hora:", selectedTime]
        ];

        details.forEach(([emoji, label, value]) => {
            const row = document.createElement("div");
            const icon = document.createElement("span");
            const strong = document.createElement("strong");
            const text = document.createElement("span");

            icon.textContent = `${emoji} `;
            strong.textContent = `${label} `;
            text.textContent = value;

            row.append(icon, strong, text);
            summary.appendChild(row);
        });

        showStep(4);
        launchConfetti();
    });

    // Abrir la carta secreta

function openLetter() {
    envelope.classList.add("open");
    envelope.setAttribute("aria-expanded", "true");

    secret.hidden = false;
    secret.classList.add("show");

    envelopeHint.textContent =
        "Carta abierta.";

    launchConfetti(24);
}


    envelope.addEventListener("click", openLetter);

    // Confeti
    function launchConfetti(count = 75) {
        const colors = [
            "#e95d91",
            "#ffc857",
            "#a78bfa",
            "#7dd3fc",
            "#fb7185",
            "#86efac"
        ];

        for (let i = 0; i < count; i++) {
            const bit = document.createElement("i");

            bit.className = "confetti";
            bit.style.left = `${Math.random() * 100}vw`;
            bit.style.background =
                colors[Math.floor(Math.random() * colors.length)];

            bit.style.borderRadius =
                Math.random() > 0.5 ? "50%" : "2px";

            bit.style.animationDuration =
                `${2.3 + Math.random() * 2.8}s`;

            bit.style.animationDelay =
                `${Math.random() * 0.4}s`;

            document.body.appendChild(bit);

            bit.addEventListener("animationend", () => {
                bit.remove();
            }, { once: true });
        }
    }

    // Reiniciar la invitación

againBtn.addEventListener("click", () => {
    // Reiniciar los datos seleccionados.
    selectedKind = "";
    selectedEmoji = "";
    selectedTime = "";
    noAttempts = 0;

    // Restaurar el botón NO.
    noBtn.style.transform = "";
    noBtn.textContent = "No";
    noToast.textContent = "";

    // Limpiar las selecciones.
    choices.forEach((button) => {
        button.classList.remove("selected");
    });

    timeButtons.forEach((button) => {
        button.classList.remove("selected");
    });

    // Reiniciar los botones.
    toDateBtn.disabled = true;
    confirmBtn.disabled = true;

    // Limpiar la fecha.
    dateInput.value = "";
    dateInput.min = getLocalDate();

    // Cerrar y ocultar la carta.
    envelope.classList.remove("open");
    envelope.setAttribute("aria-expanded", "false");

    secret.classList.remove("show");
    secret.hidden = true;

    envelopeHint.textContent =
        "Toca el sobre para abrir tu carta secreta";

    // Limpiar el resumen anterior.
    summary.replaceChildren();

    // Eliminar el confeti restante.
    document.querySelectorAll(".confetti").forEach((bit) => {
        bit.remove();
    });

    // Regresar a la pantalla inicial.
    showStep(0);
});

});

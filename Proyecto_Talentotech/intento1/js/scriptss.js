document.addEventListener("DOMContentLoaded", function () {
    const estratoInput = document.getElementById("estrato"); // Asegúrate de tener este elemento
    const estrato = estratoInput.value.trim();
    const costoData = data.find(d => d.costo_estrato);

    if (!costoData || !costoData.costo_estrato[estrato]) {
        alert("Estrato no válido");
        return;
    }

    const costoEstrato = costoData.costo_estrato[estrato];

    // Lista de electrodomésticos y su configuración de niveles
    const electrodomesticos = [
        "nevera", "lavadora", "televisor", "plancha", "planchavap",
        "micro", "aire", "freidora", "licuadora", "ventilador", "arroz"
    ];

    // Función para asignar eventos a los electrodomésticos
    function configurarDispositivo(baseId, niveles = 2) {
        const main = document.getElementById(baseId);
        if (!main) return;

        main.addEventListener("change", function () {
            const next1 = document.getElementById(`${baseId}1`);
            const input1 = document.getElementById(`${baseId}_1`);
            const isActive = this.value === 'si';

            if (input1) {
                input1.disabled = !isActive;
                input1.style.display = isActive ? 'block' : 'none';
            }
            if (next1) next1.style.display = isActive ? 'block' : 'none';

            // Resetear nivel 2 si se desactiva el nivel 1
            if (!isActive && niveles === 3) {
                const next2 = document.getElementById(`${baseId}2`);
                const input2 = document.getElementById(`${baseId}_2`);
                if (input2) {
                    input2.disabled = true;
                    input2.style.display = 'none';
                }
                if (next2) next2.style.display = 'none';
            }
        });

        // Segundo nivel (ej: nevera_1 → nevera_2)
        if (niveles === 3) {
            const input1 = document.getElementById(`${baseId}_1`);
            const next2 = document.getElementById(`${baseId}2`);
            const input2 = document.getElementById(`${baseId}_2`);

            if (input1 && input2 && next2) {
                input1.addEventListener("change", function () {
                    const hasValue = this.value !== '';
                    input2.disabled = !hasValue;
                    input2.style.display = hasValue ? 'block' : 'none';
                    next2.style.display = hasValue ? 'block' : 'none';
                });
            }
        }
    }

    // Dispositivos que tienen 3 niveles (base, _1, _2)
    const conTresNiveles = ["nevera", "lavadora", "televisor", "aire", "ventilador", "arroz"];

    // Aplicar configuración a todos los dispositivos
    electrodomesticos.forEach(id => {
        const niveles = conTresNiveles.includes(id) ? 3 : 2;
        configurarDispositivo(id, niveles);
    });
});
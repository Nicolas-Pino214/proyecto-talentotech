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

  /*   fetch("json/datos_electro.json")
        .then(response => response.json())
        .then(data => {
            document.getElementById("button").addEventListener("click", function () {
                const estrato = estratoInput.value;
                const costoEstrato = data[0].costo_estrato[estrato];

                if (!costoEstrato) {
                    alert("Estrato no válido");
                    return;
                }
                let total = 0;
        
            // Función auxiliar para obtener valor de variante y multiplicar por cantidad
            function calcularConsumo(nombre, tipo, cantidad) {
                const item = data.find(d => d.nombre.toLowerCase() === nombre.toLowerCase());
                if (!item) return 0;
                if (item.variantes) {
                    return item.variantes[tipo] * cantidad * costoEstrato;
                } else if (item.potencia_kwh_mes) {
                    return item.potencia_kwh_mes * cantidad * costoEstrato;
                } else {
                    return 0;
                }
            }
        
            // Nevera
            if (nevera.value === "si") {
                const tipo = nevera_1.value.toUpperCase(); // A, B, C...
                const cantidad = parseInt(nevera_2.value) || 0;
                total += calcularConsumo("Nevera", tipo, cantidad);
            }
        
            // Lavadora
            if (lavadora.value === "si") {
                const tipo = lavadora_1.value.toUpperCase();
                const cantidad = parseInt(lavadora_2.value) || 0;
                total += calcularConsumo("Lavadora", tipo, cantidad);
            }
        
            // Televisor
            if (televisor.value === "si") {
                const tipo = televisor_1.value === "alto" ? "altoConsumo" : "bajoConsumo";
                const cantidad = parseInt(televisor_2.value) || 0;
                total += calcularConsumo("Televisor", tipo, cantidad);
            }
        
            // Plancha
            if (plancha.value === "si") {
                const cantidad = parseInt(plancha_1.value) || 0;
                total += calcularConsumo("Plancha", null, cantidad);
            }
        
            // Plancha a vapor
            if (planchavap.value === "si") {
                const cantidad = parseInt(planchavap_1.value) || 0;
                total += calcularConsumo("Plancha_vapor", null, cantidad);
            }
        
            // Microondas
            if (micro.value === "si") {
                const cantidad = parseInt(micro_1.value) || 0;
                total += calcularConsumo("Microondas", null, cantidad);
            }
        
            // Aire Acondicionado
            if (aire.value === "si") {
                const tipo = aire_1.value.toLowerCase(); // ventana, split, etc.
                const cantidad = parseInt(aire_2.value) || 0;
                total += calcularConsumo("Aire_acondicionado", tipo, cantidad);
            }
        
            // Freidora de Aire
            if (freidora.value === "si") {
                const cantidad = parseInt(freidora_1.value) || 0;
                total += calcularConsumo("AirFryer", null, cantidad);
            }
        
            // Licuadora
            if (licuadora.value === "si") {
                const cantidad = parseInt(licuadora_1.value) || 0;
                total += calcularConsumo("Licuadora", null, cantidad);
            }
        
            // Ventilador
            if (ventilador.value === "si") {
                const tipo = ventilador_1.value.toLowerCase(); // pedestal o turbo
                const cantidad = parseInt(ventilador_2.value) || 0;
                total += calcularConsumo("Ventilador", tipo, cantidad);
            }
        
            // Arrocera
            if (arroz.value === "si") {
                const tipo = arroz_1.value.toLowerCase(); // mediana o grande
                const cantidad = parseInt(arroz_2.value) || 0;
                total += calcularConsumo("Arrocera", tipo, cantidad);
            }
        
            // Mostrar resultado
            const outputBox = document.querySelector(".outputBox");
                outputBox.style.display = "block";
                outputBox.innerHTML = `<p>Consumo total estimado mensual: <strong>$${total.toFixed(2)}</strong></p>`;
            });
        })
        .catch(error => {
            console.error("Error cargando el JSON:", error);
        });


   */
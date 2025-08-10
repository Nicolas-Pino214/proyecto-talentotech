// Variables globales para almacenar los datos
let datosElectrodomesticos = [];

// Función para cargar los datos del JSON
async function cargarDatos() {
    try {
        const response = await fetch('json/datos_electro.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        datosElectrodomesticos = await response.json();
        console.log('Datos cargados exitosamente:', datosElectrodomesticos);
        
        // Verificar que los datos tienen el formato esperado
        if (!Array.isArray(datosElectrodomesticos) || datosElectrodomesticos.length === 0) {
            throw new Error('El formato de los datos no es correcto');
        }
        
    } catch (error) {
        console.error('Error al cargar los datos:', error);
        alert('Error al cargar los datos de electrodomésticos. Verifica que el archivo json/datos_electro.json existe y tiene el formato correcto.');
    }
}

// Función para mostrar/ocultar campos secundarios según la selección
function configurarEventosFormulario() {
    // Configurar eventos para todos los electrodomésticos
    const electrodomesticos = [
        'nevera', 'lavadora', 'televisor', 'plancha', 'planchavap', 
        'micro', 'aire', 'freidora', 'licuadora', 'ventilador', 'arroz'
    ];

    electrodomesticos.forEach(electro => {
        const selectPrincipal = document.getElementById(electro);
        if (selectPrincipal) {
            selectPrincipal.addEventListener('change', function() {
                mostrarCamposSecundarios(electro, this.value);
            });
        }
    });
}

// Función para mostrar campos secundarios
function mostrarCamposSecundarios(electrodomestico, valor) {
    const label1 = document.getElementById(electrodomestico + '1');
    const select1 = document.getElementById(electrodomestico + '_1');
    const label2 = document.getElementById(electrodomestico + '2');
    const input2 = document.getElementById(electrodomestico + '_2');

    if (valor === 'si') {
        // Mostrar campos secundarios
        if (label1) {
            label1.style.display = 'inline';
            select1.style.display = 'inline';
            select1.disabled = false;
        }
        if (label2) {
            label2.style.display = 'inline';
            input2.style.display = 'inline';
            input2.disabled = false;
        }
    } else {
        // Ocultar campos secundarios
        if (label1) {
            label1.style.display = 'none';
            select1.style.display = 'none';
            select1.disabled = true;
            select1.value = '';
        }
        if (label2) {
            label2.style.display = 'none';
            input2.style.display = 'none';
            input2.disabled = true;
            input2.value = '';
        }
    }
}

// Función para obtener el costo por estrato
function obtenerCostoEstrato(estrato) {
    const costoEstratoData = datosElectrodomesticos.find(item => item.costo_estrato);
    return costoEstratoData ? costoEstratoData.costo_estrato[estrato] : 0;
}

// Función para obtener datos de un electrodoméstico específico
function obtenerDatosElectrodomestico(nombreElectro) {
    return datosElectrodomesticos.find(item => {
        // Verificar que el item tenga la propiedad nombre
        if (!item.nombre) return false;
        
        const nombreNormalizado = nombreElectro.toLowerCase().replace('_', '');
        const itemNormalizado = item.nombre.toLowerCase().replace('_', '');
        return itemNormalizado === nombreNormalizado || 
               (nombreElectro === 'planchavap' && item.nombre === 'Plancha_vapor') ||
               (nombreElectro === 'micro' && item.nombre === 'Microondas') ||
               (nombreElectro === 'aire' && item.nombre === 'Aire_acondicionado') ||
               (nombreElectro === 'freidora' && item.nombre === 'AirFryer') ||
               (nombreElectro === 'arroz' && item.nombre === 'Arrocera');
    });
}

// Función principal de cálculo
function calcularConsumo() {
    // Verificar que los datos se han cargado
    if (!datosElectrodomesticos || datosElectrodomesticos.length === 0) {
        alert('Los datos de electrodomésticos no se han cargado. Por favor, recarga la página.');
        return;
    }

    // Obtener el estrato seleccionado
    const estrato = document.getElementById('estrato').value;
    if (!estrato) {
        alert('Por favor seleccione su estrato social');
        return;
    }

    const costoKwh = obtenerCostoEstrato(estrato);
    let consumoTotal = 0;
    let detalleConsumo = '<h3>Detalle del Consumo Energético</h3>';

    // Array con la configuración de cada electrodoméstico
    const electrodomesticosConfig = [
        { id: 'nevera', nombre: 'Nevera', tieneVariantes: true },
        { id: 'lavadora', nombre: 'Lavadora', tieneVariantes: true },
        { id: 'televisor', nombre: 'Televisor', tieneVariantes: true, mapeoVariantes: { 'alto': 'altoConsumo', 'bajo': 'bajoConsumo' }},
        { id: 'plancha', nombre: 'Plancha', tieneVariantes: false },
        { id: 'planchavap', nombre: 'Plancha_vapor', tieneVariantes: false },
        { id: 'micro', nombre: 'Microondas', tieneVariantes: false },
        { id: 'aire', nombre: 'Aire_acondicionado', tieneVariantes: true, mapeoVariantes: { 
            'ventana': 'ventana', 'split': 'split', 'splitInv': 'split_inverter', 
            'miniSplit': 'miniSplit', 'central': 'central' 
        }},
        { id: 'freidora', nombre: 'AirFryer', tieneVariantes: false },
        { id: 'licuadora', nombre: 'Licuadora', tieneVariantes: false },
        { id: 'ventilador', nombre: 'Ventilador', tieneVariantes: true },
        { id: 'arroz', nombre: 'Arrocera', tieneVariantes: true }
    ];

    // Procesar cada electrodoméstico
    electrodomesticosConfig.forEach(config => {
        const tieneElectro = document.getElementById(config.id).value;
        
        if (tieneElectro === 'si') {
            const datosElectro = obtenerDatosElectrodomestico(config.id);
            
            if (!datosElectro) {
                console.error(`No se encontraron datos para: ${config.nombre}`);
                return;
            }

            let potenciaKwh = 0;
            let tipoSeleccionado = '';

            if (config.tieneVariantes) {
                const selectTipo = document.getElementById(config.id + '_1');
                if (selectTipo && selectTipo.value) {
                    let valorTipo = selectTipo.value;
                    
                    // Mapear valores si es necesario
                    if (config.mapeoVariantes && config.mapeoVariantes[valorTipo]) {
                        valorTipo = config.mapeoVariantes[valorTipo];
                    }
                    
                    // Convertir a mayúscula para nevera y lavadora
                    if (config.id === 'nevera' || config.id === 'lavadora') {
                        valorTipo = valorTipo.toUpperCase();
                    }
                    
                    potenciaKwh = datosElectro.variantes[valorTipo] || 0;
                    tipoSeleccionado = ` (${selectTipo.options[selectTipo.selectedIndex].text})`;
                }
            } else {
                potenciaKwh = datosElectro.potencia_kwh_mes || 0;
            }

            const cantidadInput = document.getElementById(config.id + '_2');
            const cantidad = cantidadInput ? parseInt(cantidadInput.value) || 1 : 1;

            const consumoElectro = potenciaKwh * cantidad;
            consumoTotal += consumoElectro;

            if (consumoElectro > 0) {
                detalleConsumo += `<p><strong>${config.nombre}${tipoSeleccionado}:</strong> ${cantidad} unidad(es) × ${potenciaKwh} kWh = ${consumoElectro.toFixed(2)} kWh/mes</p>`;
            }
        }
    });

    // Calcular el costo final
    const costo_final = consumoTotal * costoKwh;

    // Obtener información del usuario
    const nombre = document.getElementById('name').value;
    const ubicacion = document.getElementById('location').value;

    // Mostrar resultado
    const outputBox = document.querySelector('.outputBox');
    outputBox.innerHTML = `
        <div style="background-color: #f0f8ff; padding: 20px; border-radius: 10px; margin-top: 20px; border: 2px solid #4CAF50;">
            <h2 style="color: #2e7d32; text-align: center;">Resultado del Cálculo</h2>
            <p><strong>Usuario:</strong> ${nombre}</p>
            <p><strong>Ubicación:</strong> ${ubicacion}</p>
            <p><strong>Estrato:</strong> ${estrato}</p>
            <hr>
            ${detalleConsumo}
            <hr>
            <div style="background-color: #e8f5e8; padding: 15px; border-radius: 5px;">
                <p><strong>Consumo Total:</strong> ${consumoTotal.toFixed(2)} kWh/mes</p>
                <p><strong>Costo por kWh (Estrato ${estrato}):</strong> $${costoKwh.toFixed(2)} COP</p>
                <h3 style="color: #1976d2; font-size: 24px; text-align: center;">
                    <strong>Costo Final: $${costo_final.toFixed(2)} COP/mes</strong>
                </h3>
            </div>
            <div style="margin-top: 15px; padding: 10px; background-color: #fff3e0; border-radius: 5px;">
                <p><strong>💡 Tip:</strong> Los electrodomésticos con mejor eficiencia energética (tipo A) pueden ayudarte a ahorrar significativamente en tu factura eléctrica.</p>
            </div>
        </div>
    `;

    // Scroll hacia el resultado
    outputBox.scrollIntoView({ behavior: 'smooth' });
}

// Inicializar cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    // Cargar datos del JSON
    cargarDatos();
    
    // Configurar eventos del formulario
    configurarEventosFormulario();
    
    // Configurar el botón de calcular
    const botonCalcular = document.getElementById('button');
    if (botonCalcular) {
        botonCalcular.addEventListener('click', calcularConsumo);
    }
});

// Función de validación adicional (opcional)
function validarFormulario() {
    const camposRequeridos = ['name', 'gender', 'estrato'];
    
    for (let campo of camposRequeridos) {
        const elemento = document.querySelector(`[name="${campo}"]:checked`) || document.getElementById(campo);
        if (!elemento || !elemento.value) {
            alert(`Por favor complete el campo: ${campo}`);
            return false;
        }
    }
    return true;
}

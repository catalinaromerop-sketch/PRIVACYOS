/* =========================================================
   PRIVACYOS
   Motor de análisis de privacidad
   MVP académico
========================================================= */


/* =========================================================
   DATOS PERSONALES
========================================================= */

const dataRules = {

    "Nombre": [
        "nombre",
        "name"
    ],

    "Correo electrónico": [
        "correo",
        "email",
        "e-mail"
    ],

    "Teléfono": [
        "telefono",
        "teléfono",
        "phone"
    ],

    "Dirección": [
        "direccion",
        "dirección",
        "domicilio",
        "address"
    ],

    "Ubicación": [
        "ubicacion",
        "ubicación",
        "gps",
        "geolocalizacion",
        "geolocalización",
        "location"
    ],

    "Dirección IP": [
        "direccion ip",
        "dirección ip",
        "ip address"
    ],

    "Datos de uso": [
        "datos de uso",
        "navegacion",
        "navegación",
        "usage data"
    ],

    "Cookies": [
        "cookies",
        "identificadores"
    ],

    "Datos de salud": [
        "salud",
        "medico",
        "médico",
        "health"
    ],

    "Datos financieros": [
        "financiero",
        "tarjeta",
        "banco",
        "cuenta bancaria",
        "payment"
    ]

};


/* =========================================================
   SEÑALES DE RIESGO
========================================================= */

const riskRules = [

    {

        key: "third",

        title: "Terceros / proveedores",

        terms: [
            "proveedores",
            "terceros",
            "compartir",
            "compartimos",
            "partners",
            "publicidad"
        ],

        points: 12,

        description:
            "Se detectan referencias a terceros, proveedores, publicidad o servicios externos."

    },


    {

        key: "transfer",

        title: "Posible transferencia internacional",

        terms: [
            "fuera de chile",
            "fuera del país",
            "fuera del pais",
            "internacional",
            "transferencia internacional",
            "otros países",
            "otros paises"
        ],

        points: 15,

        description:
            "El texto menciona procesamiento o transferencia de datos fuera del territorio de referencia."

    },


    {

        key: "profiling",

        title: "Perfilamiento / personalización",

        terms: [
            "perfil",
            "perfiles",
            "perfilamiento",
            "profiling"
        ],

        points: 10,

        description:
            "Se detecta creación de perfiles o personalización basada en datos."

    },


    {

        key: "retention",

        title: "Conservación de datos",

        terms: [
            "conservamos",
            "conservar",
            "retencion",
            "retención",
            "mientras sea necesaria"
        ],

        points: 8,

        description:
            "Existe una referencia a conservación. Conviene revisar si el plazo está suficientemente definido."

    },


    {

        key: "cookies",

        title: "Cookies / tecnologías de seguimiento",

        terms: [
            "cookies",
            "tecnologias similares",
            "tecnologías similares"
        ],

        points: 7,

        description:
            "Se detectan tecnologías que pueden requerir información y controles adicionales."

    },


    {

        key: "rights",

        title: "Derechos del titular",

        terms: [
            "acceso",
            "rectificacion",
            "rectificación",
            "eliminacion",
            "eliminación",
            "oposicion",
            "oposición",
            "derechos"
        ],

        points: -8,

        description:
            "Se observan referencias a derechos del titular de los datos."

    }

];


/* =========================================================
   REGULACIONES
========================================================= */

const regulations = [

    {

        code: "CL",

        name: "Ley 21.719",

        description:
            "Chile · protección de datos personales."

    },

    {

        code: "EU",

        name: "GDPR",

        description:
            "Unión Europea · Reglamento General de Protección de Datos."

    },

    {

        code: "BR",

        name: "LGPD",

        description:
            "Brasil · Lei Geral de Proteção de Dados."

    },

    {

        code: "CA",

        name: "CCPA / CPRA",

        description:
            "California · derechos sobre información personal."

    }

];


/* =========================================================
   VARIABLES
========================================================= */

let lastReport = null;


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizeText(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

}


/* =========================================================
   BUSCAR PALABRAS
========================================================= */

function containsAny(text, terms) {

    return terms.some(
        term => text.includes(normalizeText(term))
    );

}


/* =========================================================
   ANALIZAR
========================================================= */

function analyzePrivacy() {

    const rawText =
        document
            .getElementById("policyText")
            .value
            .trim();


    if (rawText.length < 30) {

        alert(
            "Por favor ingresa una política o texto de al menos 30 caracteres."
        );

        return;

    }


    const text =
        normalizeText(rawText);


    /* =========================================
       DATOS
    ========================================= */

    const detectedData = [];


    Object.entries(dataRules).forEach(
        ([name, terms]) => {

            if (containsAny(text, terms)) {

                detectedData.push(name);

            }

        }
    );


    /* =========================================
       RIESGOS
    ========================================= */

    const detectedRisks =
        riskRules.filter(
            rule =>
                containsAny(
                    text,
                    rule.terms
                )
        );


    /* =========================================
       SCORE
    ========================================= */

    let score = 20;


    score +=
        detectedData.length * 3;


    detectedRisks.forEach(
        risk => {

            if (risk.points > 0) {

                score += risk.points;

            }

        }
    );


    if (
        detectedData.includes("Datos de salud") ||
        detectedData.includes("Datos financieros")
    ) {

        score += 12;

    }


    score =
        Math.max(
            0,
            Math.min(
                100,
                Math.round(score)
            )
        );


    /* =========================================
       NIVEL
    ========================================= */

    let level;

    if (score >= 70) {

        level = "ALTO";

    }
    else if (score >= 45) {

        level = "MEDIO";

    }
    else {

        level = "BAJO";

    }


    /* =========================================
       TÍTULOS
    ========================================= */

    let title;
    let description;


    if (level === "ALTO") {

        title =
            "Requiere revisión prioritaria";

        description =
            "Se encontraron varias señales que justifican una revisión de privacidad más profunda.";

    }
    else if (level === "MEDIO") {

        title =
            "Requiere revisión";

        description =
            "Se identificaron señales que conviene validar antes de considerar el tratamiento como de bajo riesgo.";

    }
    else {

        title =
            "Riesgo preliminar bajo";

        description =
            "El texto presenta pocas señales de riesgo. Esto no equivale a una auditoría legal.";

    }


    /* =========================================
       FINALIDADES
    ========================================= */

    const purposes = [];


    if (
        containsAny(
            text,
            [
                "prestar el servicio",
                "proveer el servicio",
                "entregar el servicio",
                "operar"
            ]
        )
    ) {

        purposes.push(
            "Prestación del servicio"
        );

    }


    if (
        containsAny(
            text,
            [
                "analitica",
                "analítica",
                "estadistica",
                "estadística"
            ]
        )
    ) {

        purposes.push(
            "Analítica / medición"
        );

    }


    if (
        containsAny(
            text,
            [
                "publicidad",
                "marketing",
                "mercadeo"
            ]
        )
    ) {

        purposes.push(
            "Publicidad / marketing"
        );

    }


    if (
        containsAny(
            text,
            [
                "perfil",
                "perfilamiento",
                "personalizacion",
                "personalización"
            ]
        )
    ) {

        purposes.push(
            "Personalización / perfilamiento"
        );

    }


    /* =========================================
       HALLAZGOS
    ========================================= */

    const findings = [];


    detectedRisks
        .filter(
            risk =>
                risk.points > 0
        )
        .forEach(
            risk => {

                findings.push({

                    priority:
                        risk.points >= 12
                            ? "high"
                            : "medium",

                    title:
                        risk.title,

                    description:
                        risk.description

                });

            }
        );


    /* DERECHOS */

    const hasRights =
        detectedRisks.some(
            risk =>
                risk.key === "rights"
        );


    if (!hasRights) {

        findings.push({

            priority: "medium",

            title:
                "Derechos del titular no evidentes",

            description:
                "No se detectaron referencias claras a mecanismos para ejercer derechos sobre los datos personales."

        });

    }


    if (findings.length === 0) {

        findings.push({

            priority: "low",

            title:
                "Sin hallazgos críticos en el texto",

            description:
                "El motor no encontró señales prioritarias. Esto no implica cumplimiento legal."

        });

    }


    /* =========================================
       MOSTRAR RESULTADOS
    ========================================= */

    renderScore(
        score,
        level,
        title,
        description
    );


    document
        .getElementById("dataCount")
        .textContent =
        detectedData.length;


    document
        .getElementById("riskCount")
        .textContent =
        detectedRisks
            .filter(
                risk =>
                    risk.points > 0
            )
            .length;


    renderData(
        detectedData
    );


    renderPurposes(
        purposes
    );


    renderRegulations(
        detectedRisks
    );


    renderFindings(
        findings
    );


    /* =========================================
       GUARDAR REPORTE
    ========================================= */

    lastReport = {

        generatedAt:
            new Date().toISOString(),

        service:
            document
                .getElementById("serviceName")
                .value,

        url:
            document
                .getElementById("serviceUrl")
                .value,

        score:

            score,

        riskLevel:

            level,

        dataDetected:

            detectedData,

        purposes:

            purposes,

        signals:

            detectedRisks.map(
                risk =>
                    risk.title
            ),

        findings:

            findings,

        regulations:

            regulations.map(
                regulation =>
                    regulation.name
            )

    };


    /* =========================================
       MOSTRAR RESULTADOS
    ========================================= */

    document
        .getElementById("results")
        .classList
        .remove("hidden");


    document
        .getElementById("results")
        .scrollIntoView({
            behavior: "smooth"
        });

}


/* =========================================================
   SCORE
========================================================= */

function renderScore(
    score,
    level,
    title,
    description
) {

    const circle =
        document.getElementById(
            "scoreCircle"
        );


    let color;


    if (level === "ALTO") {

        color = "#ff7777";

    }
    else if (level === "MEDIO") {

        color = "#f5c96b";

    }
    else {

        color = "#55e6b2";

    }


    const degrees =
        score * 3.6;


    circle.style.background =
        `conic-gradient(
            ${color} ${degrees}deg,
            #20352f ${degrees}deg
        )`;


    document
        .getElementById("scoreValue")
        .textContent =
        score;


    const levelElement =
        document
            .getElementById("riskLevel");


    levelElement.textContent =
        level;


    levelElement.style.color =
        color;


    document
        .getElementById("riskTitle")
        .textContent =
        title;


    document
        .getElementById("riskDescription")
        .textContent =
        description;

}


/* =========================================================
   DATOS
========================================================= */

function renderData(data) {

    const container =
        document.getElementById(
            "dataList"
        );


    if (data.length === 0) {

        container.innerHTML =
            `<span class="privacy-note">
                No se detectaron categorías conocidas.
            </span>`;

        return;

    }


    container.innerHTML =
        data
            .map(
                item =>
                    `<span class="tag">
                        ${item}
                    </span>`
            )
            .join("");

}


/* =========================================================
   FINALIDADES
========================================================= */

function renderPurposes(
    purposes
) {

    const container =
        document.getElementById(
            "purposeList"
        );


    if (purposes.length === 0) {

        container.innerHTML =
            `<span class="privacy-note">
                No se detectaron finalidades explícitas.
            </span>`;

        return;

    }


    container.innerHTML =
        purposes
            .map(
                purpose =>
                    `<div class="purpose-item">
                        ${purpose}
                    </div>`
            )
            .join("");

}


/* =========================================================
   REGULACIONES
========================================================= */

function renderRegulations(
    risks
) {

    const container =
        document.getElementById(
            "regulationResults"
        );


    const hasTransfer =
        risks.some(
            risk =>
                risk.key === "transfer"
        );


    container.innerHTML =
        regulations
            .map(
                regulation => {

                    let status;


                    if (hasTransfer) {

                        status =
                            "Revisar transferencias";

                    }
                    else if (
                        risks.length > 0
                    ) {

                        status =
                            "Revisar tratamiento";

                    }
                    else {

                        status =
                            "Revisión preliminar";

                    }


                    return `

                        <div class="regulation-result">

                            <strong>
                                ${regulation.code}
                                ·
                                ${regulation.name}
                            </strong>

                            <span>
                                ${regulation.description}
                            </span>

                            <em class="regulation-status">
                                ${status}
                            </em>

                        </div>

                    `;

                }
            )
            .join("");

}


/* =========================================================
   HALLAZGOS
========================================================= */

function renderFindings(
    findings
) {

    const container =
        document.getElementById(
            "findingsList"
        );


    container.innerHTML =
        findings
            .map(
                finding => `

                    <div
                        class="finding
                        ${finding.priority === "high"
                            ? "high"
                            : finding.priority === "low"
                                ? "low"
                                : ""
                        }"
                    >

                        <strong>

                            ${
                                finding.priority === "high"
                                    ? "ALTO"
                                    : finding.priority === "low"
                                        ? "OK"
                                        : "REVISAR"
                            }

                            ·

                            ${finding.title}

                        </strong>


                        <p>

                            ${finding.description}

                        </p>

                    </div>

                `
            )
            .join("");

}


/* =========================================================
   EJEMPLO
========================================================= */

document
    .getElementById("exampleButton")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById("serviceName")
                .value =
                "Servicio Digital Demo";


            document
                .getElementById("serviceUrl")
                .value =
                "https://demo.privacyos.local";


            document
                .getElementById("policyText")
                .value =

`Esta aplicación recopila nombre, correo electrónico,
dirección IP, ubicación y datos de uso.

Utilizamos esta información para prestar el servicio,
realizar analítica y mostrar publicidad.

Podemos compartir información con proveedores de
analítica, publicidad y servicios de nube.

Algunos proveedores pueden procesar datos fuera de Chile.

Conservamos la información mientras sea necesaria
para las finalidades descritas.

El usuario puede solicitar acceso, rectificación,
eliminación y oposición al tratamiento.

Utilizamos cookies y tecnologías similares.

En algunos casos podemos crear perfiles a partir
de los datos de uso.`;


            document
                .getElementById("results")
                .classList
                .add("hidden");

        }
    );


/* =========================================================
   ANALIZAR
========================================================= */

document
    .getElementById("analyzeButton")
    .addEventListener(
        "click",
        analyzePrivacy
    );


/* =========================================================
   EXPORTAR JSON
========================================================= */

document
    .getElementById("exportButton")
    .addEventListener(
        "click",
        () => {

            if (!lastReport) {

                alert(
                    "Primero debes realizar un análisis."
                );

                return;

            }


            const json =
                JSON.stringify(
                    lastReport,
                    null,
                    2
                );


            const blob =
                new Blob(
                    [json],
                    {
                        type:
                            "application/json"
                    }
                );


            const url =
                URL.createObjectURL(
                    blob
                );


            const link =
                document.createElement(
                    "a"
                );


            link.href = url;


            link.download =
                "privacyos-reporte.json";


            link.click();


            URL.revokeObjectURL(
                url
            );

        }
    );


/* =========================================================
   NAVEGACIÓN
========================================================= */

document
    .querySelectorAll(".nav-button")
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const section =
                        button.dataset.section;


                    document
                        .querySelectorAll(
                            ".nav-button"
                        )
                        .forEach(
                            item =>
                                item.classList
                                    .remove("active")
                        );


                    button
                        .classList
                        .add("active");


                    document
                        .querySelectorAll(
                            ".page-section"
                        )
                        .forEach(
                            page =>
                                page.classList
                                    .remove("active")
                        );


                    document
                        .getElementById(
                            section
                        )
                        .classList
                        .add("active");


                    const title =
                        document
                            .getElementById(
                                "pageTitle"
                            );


                    if (
                        section ===
                        "scanner"
                    ) {

                        title.textContent =
                            "Analizador de privacidad";

                    }
                    else if (
                        section ===
                        "reports"
                    ) {

                        title.textContent =
                            "Reportes";

                    }
                    else {

                        title.textContent =
                            "Regulaciones";

                    }


                    window.scrollTo({
                        top: 0,
                        behavior: "smooth"
                    });

                }
            );

        }
    );


/* =========================================================
   VOLVER AL ANALIZADOR
========================================================= */

function goToScanner() {

    const scannerButton =
        document.querySelector(
            '[data-section="scanner"]'
        );


    scannerButton.click();

}

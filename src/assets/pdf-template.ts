// pdf-template.ts
import { style } from '@angular/animations';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DomSanitizer } from '@angular/platform-browser';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const validateFirmas = (firma) => {
    if(firma){
        return {
            image: `${firma}`, width: 150, alignment: 'center', colSpan: 2
        }
    } else {
        return {
            text: 'N/A', colSpan: 2, alignment: 'center' 
        }
    }
}

const highlighter = (option: string, value: string) => {
    let assignStyle = option === value ? 'options_highlighted' : 'options';
    
    return { text: option, style: assignStyle };
}

const convertToBase64 = (file) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        console.log(file);
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
    });
}

const reduceQuality = (base64: string, quality = 0.7) => {
    return new Promise<string>((resolve) => {
        const img = new Image();
        img.src = base64;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx?.drawImage(img, 0, 0, img.width, img.height);
            resolve(canvas.toDataURL('image/jpeg', quality)); 
        };
    });
};

const runArrayImagenes = async (images: string[]): Promise<{ image: string, width: number, alignment: string, margin: number[] }[]> => {
    if (images.length > 0) {
        const promises = images.map( async (i) => ({
            //image: await convertToBase64(i),
            image: await reduceQuality(i),
            width: 500,
            alignment: 'center',
            margin: [0, 10, 0, 10 ]
        }));
        return Promise.all(promises);
    } else {
        return [];
    }
}

export const generatePdfTemplate = async (formData: any) => {
    const arrayImages = await runArrayImagenes(formData.arrayImagenes);

    return{
        content: [
            {   //TITULO Y LOGO
                table: {
                    widths: [90, 300, '*'],
                    heights: [15, 15, 15],
                    body: [
                        
                        [{image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAABgkAAAG/CAYAAABiwDePAAABN2lDQ1BBZG9iZSBSR0IgKDE5OTgpAAAokZWPv0rDUBSHvxtFxaFWCOLgcCdRUGzVwYxJW4ogWKtDkq1JQ5ViEm6uf/oQjm4dXNx9AidHwUHxCXwDxamDQ4QMBYvf9J3fORzOAaNi152GUYbzWKt205Gu58vZF2aYAoBOmKV2q3UAECdxxBjf7wiA10277jTG+38yH6ZKAyNguxtlIYgK0L/SqQYxBMygn2oQD4CpTto1EE9AqZf7G1AKcv8ASsr1fBBfgNlzPR+MOcAMcl8BTB1da4Bakg7UWe9Uy6plWdLuJkEkjweZjs4zuR+HiUoT1dFRF8jvA2AxH2w3HblWtay99X/+PRHX82Vun0cIQCw9F1lBeKEuf1UYO5PrYsdwGQ7vYXpUZLs3cLcBC7dFtlqF8hY8Dn8AwMZP/fNTP8gAAAAJcEhZcwAALiMAAC4jAXilP3YAAAXaaVRYdFhNTDpjb20uYWRvYmUueG1wAAAAAAA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjYtYzE0MCA3OS4xNjA0NTEsIDIwMTcvMDUvMDYtMDE6MDg6MjEgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiB4bWxuczpwaG90b3Nob3A9Imh0dHA6Ly9ucy5hZG9iZS5jb20vcGhvdG9zaG9wLzEuMC8iIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdEV2dD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlRXZlbnQjIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMTktMDktMTdUMTA6NTM6NTQtMDM6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDE5LTEwLTE3VDE0OjAzLTAzOjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDE5LTEwLTE3VDE0OjAzLTAzOjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOmI3MDY4MjM3LWIxZDUtNDUzZS1iMzE5LTJiZmQ2MGI0MTEzYyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDozNDM4ODgwYi1kYjBhLTQ3MTMtOWM2Yy1jYzA1MTQyOTRlNTciIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDozNDM4ODgwYi1kYjBhLTQ3MTMtOWM2Yy1jYzA1MTQyOTRlNTciPiA8eG1wTU06SGlzdG9yeT4gPHJkZjpTZXE+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJjcmVhdGVkIiBzdEV2dDppbnN0YW5jZUlEPSJ4bXAuaWlkOjM0Mzg4ODBiLWRiMGEtNDcxMy05YzZjLWNjMDUxNDI5NGU1NyIgc3RFdnQ6d2hlbj0iMjAxOS0wOS0xN1QxMDo1Mzo1NC0wMzowMCIgc3RFdnQ6c29mdHdhcmVBZ2VudD0iQWRvYmUgUGhvdG9zaG9wIENDIChNYWNpbnRvc2gpIi8+IDxyZGY6bGkgc3RFdnQ6YWN0aW9uPSJzYXZlZCIgc3RFdnQ6aW5zdGFuY2VJRD0ieG1wLmlpZDpiNzA2ODIzNy1iMWQ1LTQ1M2UtYjMxOS0yYmZkNjBiNDExM2MiIHN0RXZ0OndoZW49IjIwMTktMTAtMTdUMTQ6MDMtMDM6MDAiIHN0RXZ0OnNvZnR3YXJlQWdlbnQ9IkFkb2JlIFBob3Rvc2hvcCBDQyAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpT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', 
                            width: 85, 
                            rowSpan: 2,
                            alignment: 'center',
                            margin: [0, 5, 0, 0]
                        }, 
                        {text: 'INSPECCION CAMIONETA DE TRANSPORTE', 
                            rowSpan: 2, style: 'header', margin: [0, 10, 0, 0]},
                        {
                            text: 'Código: PR-OPE-03', rowSpan: 1, 
                            style: {fontSize: 10, alignment: 'center', margin: [0, 10, 0, 0]}
                        }
                        ],
                        [
                            {},
                            {},
                            {text: 'Versión: 01', rowSpan: 1, alignment: 'center'}
                        ]
                    
                    ]
                }
            },
                //NOMBRE CONDUCTOR Y DATOS
            {
                table: {
                    widths: ['*', '*', '*', '*'],
                    heights: [12, 12, 12, 12, 12, 12],
                    body: [
                        [
                            {text: `FAENA`, style: 'formTitle'},
                            {text: 'LUGAR', style: 'formTitle'},
                            {text: 'NOMBRE CONDUCTOR', style: 'formTitle'},
                            {text: 'NOMBRE ACOMPAÑANTE', style: 'formTitle'}
                            
                        ],
                        [
                            {text: `${formData.faena || 'N/A'}`},
                            {text: `${formData.lugar || 'N/A'}`},
                            {text: `${formData.conductor || 'N/A'}`},
                            {text: `${formData.acompanante || 'N/A'}`}
                        ],
                        [
                            {text: 'PATENTE', style: 'formTitle'},
                            {text: 'MARCA', style: 'formTitle'},
                            {text: 'KILOMETRAJE INICIO', style: 'formTitle'},
                            {text: 'KILOMETRAJE FINAL' , style: 'formTitle'},
                        ],
                        [
                            {text: `${formData.patente || 'N/A'}`},
                            {text: `${formData.marca || 'N/A'}`},
                            {text: `${formData.km_inicio || 'N/A'}`},
                            {text: `${formData.km_final || 'N/A'}`}
                        ],
                        [
                            {text: 'TIPO DE COMBUSTIBLE', colSpan: 2, style: 'formTitle'},
                            {},
                            {text: 'PRÓXIMA MANTENCIÓN', colSpan: 2, style: 'formTitle'},
                            {}
                        ],
                        [
                            {text: `${formData.combustible || 'N/A'}`, colSpan: 2},
                            {},
                            {text: `${formData.prox_mantencion || 'N/A'}`, colSpan: 2},
                            {}
                        ]
                    ]
                }
            },
            {   //FORM
                table: {
                    widths: [20, '*', 20, 20, 20, 20, 20, '*', 20, 20, 20, 20],
                    //heights: [15],
                    body: [
                        [
                            {text: 'ITEM', style: 'item'}, 
                            {text: 'PARTES', style: 'formTitle'}, 
                            {text: 'VERIFICACION', colSpan: 4, style: 'formTitle'},
                            {},
                            {},
                            {},
                            {text: '4', style: 'formTitle'}, 
                            {text: 'ORDEN, LIMPIEZA Y ASEO', style: 'formTitle'}, 
                            {text: 'VERIFICACION', colSpan: 4, style: 'formTitle'},
                            {},
                            {},
                            {}
                            
                        ],
                        [
                            {text: '1', style: 'formTitle'},
                            {text: 'CONDICIONES DEL MOVIL', style: 'formTitle'},
                            {text: 'VERIFICACION', colSpan: 4, style: 'formTitle'},
                            {},
                            {},
                            {},
                            {text: "4.1", style: 'itemNumbers'},
                            {text: "Habitáculo de Pasajeros", style: 'formBody'},
                            highlighter('B', formData.habitaculo),
                            highlighter('R', formData.habitaculo),
                            highlighter('M', formData.habitaculo),
                            highlighter('N/A', formData.habitaculo),
                        ],
                        [
                            {text: '1.1', style: 'itemNumbers'},
                            {text: 'Dirección', style: 'formBody'},
                            highlighter('B', formData.direccion),
                            highlighter('R', formData.direccion),
                            highlighter('M', formData.direccion),
                            highlighter('N/A', formData.direccion),
                            {text: '4.2', style: 'itemNumbers'},
                            {text: 'Carrocería y Gabinetes', style: 'formBody'},
                            highlighter('B', formData.carroceria_gabinete),
                            highlighter('R', formData.carroceria_gabinete),
                            highlighter('M', formData.carroceria_gabinete),
                            highlighter('N/A', formData.carroceria_gabinete),
                        ],
                        [
                            {text: '1.2', style: 'itemNumbers'},
                            {text: 'Cinturón de Seguridad', style: 'formBody'},
                            highlighter('B', formData.cinturon),
                            highlighter('R', formData.cinturon),
                            highlighter('M', formData.cinturon),
                            highlighter('N/A', formData.cinturon),
                            {text: '5', style: 'formTitle'}, 
                            {text: 'DOCUMENTOS', style: 'formTitle'}, 
                            {text: 'VERIFICACION', colSpan: 4, style: 'formTitle'},
                            {},
                            {},
                            {}
                        ],
                        [
                            {text: '1.3', style: 'itemNumbers'},
                            {text: 'Carrocería', style: 'formBody'},
                            highlighter('B', formData.carroceria),
                            highlighter('R', formData.carroceria),
                            highlighter('M', formData.carroceria),
                            highlighter('N/A', formData.carroceria),
                            {text: "5.1", style: 'itemNumbers'},
                            {text: "Revisión Técnica y Gases", style: 'formBody'},
                            highlighter('B', formData.revision_tecnica),
                            highlighter('R', formData.revision_tecnica),
                            highlighter('M', formData.revision_tecnica),
                            highlighter('N/A', formData.revision_tecnica),
                        ],
                        [
                            {text: '1.4', style: 'itemNumbers'},
                            {text: 'Bocina', style: 'formBody'},
                            highlighter('B', formData.bocina),
                            highlighter('R', formData.bocina),
                            highlighter('M', formData.bocina),
                            highlighter('N/A', formData.bocina),
                            {text: '5.2', style: 'itemNumbers'},
                            {text: 'Permiso Circulación y SOAP', style: 'formBody'},
                            highlighter('B', formData.permiso_circulacion),
                            highlighter('R', formData.permiso_circulacion),
                            highlighter('M', formData.permiso_circulacion),
                            highlighter('N/A', formData.permiso_circulacion),
                        ],
                        [
                            {text: '1.5', style: 'itemNumbers'},
                            {text: 'Aire Acondicionado y Calefacción', style: 'formBody'},
                            highlighter('B', formData.aire_calefaccion),
                            highlighter('R', formData.aire_calefaccion),
                            highlighter('M', formData.aire_calefaccion),
                            highlighter('N/A', formData.aire_calefaccion),
                            {text: '5.3', style: 'itemNumbers'},
                            {text: 'Licencia de Conducir', style: 'formBody'},
                            highlighter('B', formData.licencia_conducir),
                            highlighter('R', formData.licencia_conducir),
                            highlighter('M', formData.licencia_conducir),
                            highlighter('N/A', formData.licencia_conducir),
                        ],
                        [
                            {text: '1.6', style: 'itemNumbers'},
                            {text: 'Estado de Asientos y Cabina', style: 'formBody'},
                            highlighter('B', formData.asientos_cabina),
                            highlighter('R', formData.asientos_cabina),
                            highlighter('M', formData.asientos_cabina),
                            highlighter('N/A', formData.asientos_cabina),
                            {text: '6', style: 'formTitle'},
                            {text: 'MOTOR Y NIVELES', style: 'formTitle'},
                            {text: 'VERIFICACION', style: 'formTitle', colSpan: 4},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '1.7', style: 'itemNumbers'},
                            {text: 'Limpia Parabrisas', style: 'formBody'},
                            highlighter('B', formData.limpiaparabrisas),
                            highlighter('R', formData.limpiaparabrisas),
                            highlighter('M', formData.limpiaparabrisas),
                            highlighter('N/A', formData.limpiaparabrisas),
                            {text: '6.1', style: 'itemNumbers'},
                            {text: 'Batería, Bornes, Fusibles y Filtro de Polvo', style: 'formBody'},
                            highlighter('B', formData.bateria_fusibles),
                            highlighter('R', formData.bateria_fusibles),
                            highlighter('M', formData.bateria_fusibles),
                            highlighter('N/A', formData.bateria_fusibles),
                        ],
                        [
                            {text: '1.8', style: 'itemNumbers'},
                            {text: 'Frenos', style: 'formBody'},
                            highlighter('B', formData.frenos),
                            highlighter('R', formData.frenos),
                            highlighter('M', formData.frenos),
                            highlighter('N/A', formData.frenos),
                            {text: '6.2', style: 'itemNumbers'},
                            {text: 'Correas y Filtro RACOR PURGADO', style: 'formBody'},
                            highlighter('B', formData.correas_filtro),
                            highlighter('R', formData.correas_filtro),
                            highlighter('M', formData.correas_filtro),
                            highlighter('N/A', formData.correas_filtro),
                        ],
                        [
                            {text: '1.9', style: 'itemNumbers'},
                            {text: 'Estado de Neumáticos', style: 'formBody'},
                            highlighter('B', formData.neumaticos),
                            highlighter('R', formData.neumaticos),
                            highlighter('M', formData.neumaticos),
                            highlighter('N/A', formData.neumaticos),
                            {text: '6.3', style: 'itemNumbers'},
                            {text: 'Niveles (Agua, Aceite, Hidráulico y Freno)', style: 'formBody'},
                            highlighter('B', formData.niveles),
                            highlighter('R', formData.niveles),
                            highlighter('M', formData.niveles),
                            highlighter('N/A', formData.niveles),
                        ],
                        [
                            {text: '1.10', style: 'itemNumbers'},
                            {text: 'Estado del Tablero', style: 'formBody'},
                            highlighter('B', formData.tablero),
                            highlighter('R', formData.tablero),
                            highlighter('M', formData.tablero),
                            highlighter('N/A', formData.tablero),
                            {text: '6.4', style: 'itemNumbers'},
                            {text: 'Filtro Partículas Diésel (DPF)', style: 'formBody'},
                            highlighter('B', formData.filtro_particulas),
                            highlighter('R', formData.filtro_particulas),
                            highlighter('M', formData.filtro_particulas),
                            highlighter('N/A', formData.filtro_particulas),
                        ],
                        [
                            {text: '1.11', style: 'itemNumbers'},
                            {text: 'Parabrisas y Ventanas', style: 'formBody'},
                            highlighter('B', formData.parabrisas_ventanas),
                            highlighter('R', formData.parabrisas_ventanas),
                            highlighter('M', formData.parabrisas_ventanas),
                            highlighter('N/A', formData.parabrisas_ventanas),
                            {text: '7', style: 'formTitle'},
                            {text: 'OTROS', style: 'formTitle'},
                            {text: 'VERIFICACION', style: 'formTitle', colSpan: 4},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '1.12', style: 'itemNumbers'},
                            {text: 'Estado de Puertas y Bisagras', style: 'formBody'},
                            highlighter('B', formData.puertas_bisagras),
                            highlighter('R', formData.puertas_bisagras),
                            highlighter('M', formData.puertas_bisagras),
                            highlighter('N/A', formData.puertas_bisagras),
                            {text: '7.1', style: 'itemNumbers'},
                            {text: 'Winche y Control', style: 'formBody'},
                            highlighter('B', formData.winche_control),
                            highlighter('R', formData.winche_control),
                            highlighter('M', formData.winche_control),
                            highlighter('N/A', formData.winche_control),
                        ],
                        [
                            {text: '2', style: 'formTitle'},
                            {text: 'EQUIPOS DE SEGURIDAD', style: 'formTitle'},
                            {text: 'VERIFICACION', style: 'formTitle', colSpan: 4},
                            {},
                            {},
                            {},
                            {text: '7.2', style: 'itemNumbers'},
                            {text: 'Sistema Mobileye', style: 'formBody'},
                            highlighter('B', formData.mobileye),
                            highlighter('R', formData.mobileye),
                            highlighter('M', formData.mobileye),
                            highlighter('N/A', formData.mobileye),
                        ],
                        [
                            {text: '2.1', style: 'itemNumbers'},
                            {text: 'Extintor (es)', style: 'formBody'},
                            highlighter('B', formData.extintor),
                            highlighter('R', formData.extintor),
                            highlighter('M', formData.extintor),
                            highlighter('N/A', formData.extintor),
                            {text: '7.3', style: 'itemNumbers'},
                            {text: 'Soportes Extintores', style: 'formBody'},
                            highlighter('B', formData.soporte_extintores),
                            highlighter('R', formData.soporte_extintores),
                            highlighter('M', formData.soporte_extintores),
                            highlighter('N/A', formData.soporte_extintores),
                        ],
                        [
                            {text: '2.2', style: 'itemNumbers'},
                            {text: 'Triángulos', style: 'formBody'},
                            highlighter('B', formData.triangulos),
                            highlighter('R', formData.triangulos),
                            highlighter('M', formData.triangulos),
                            highlighter('N/A', formData.triangulos),
                            {text: '8', style: 'formTitle'},
                            {text: 'FATIGA Y SOMNOLENCIA', style: 'formTitle'},
                            {text: 'VERIFICACION', style: 'formTitle', colSpan: 4},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '2.3', style: 'itemNumbers'},
                            {text: 'Botiquín', style: 'formBody'},
                            highlighter('B', formData.botiquin),
                            highlighter('R', formData.botiquin),
                            highlighter('M', formData.botiquin),
                            highlighter('N/A', formData.botiquin),
                            {text: '8.1', style: 'itemNumbers'},
                            {text: 'Estoy en óptimas condiciones físicas y mentales para conducir de forma segura', style: 'formBody', colSpan: 3},
                            {},
                            {},
                            highlighter('SI', formData.punto1_fatiga),
                            highlighter('NO', formData.punto1_fatiga),
                        ],
                        [
                            {text: '2.4', style: 'itemNumbers'},
                            {text: 'Gata, Llave de Rueda', style: 'formBody'},
                            highlighter('B', formData.gata),
                            highlighter('R', formData.gata),
                            highlighter('M', formData.gata),
                            highlighter('N/A', formData.gata),
                            {text: '8.2', style: 'itemNumbers'},
                            {text: 'Conozco peligros y riesgos asociados a conducción', style: 'formBody', colSpan: 3},
                            {},
                            {},
                            highlighter('SI', formData.punto2_fatiga),
                            highlighter('NO', formData.punto2_fatiga),
                        ],
                        [
                            {text: '2.5', style: 'itemNumbers'},
                            {text: 'Chaleco Reflectante', style: 'formBody'},
                            highlighter('B', formData.chaleco),
                            highlighter('R', formData.chaleco),
                            highlighter('M', formData.chaleco),
                            highlighter('N/A', formData.chaleco),
                            {text: '8.3', style: 'itemNumbers'},
                            {text: 'Aplicaré las medidas de control para evitar accidentes vehiculares', style: 'formBody', colSpan: 3},
                            {},
                            {},
                            highlighter('SI', formData.punto3_fatiga),
                            highlighter('NO', formData.punto3_fatiga),
                        ],
                        [
                            {text: '2.6', style: 'itemNumbers'},
                            {text: 'Estado Tuercas e Indicador de Posición', style: 'formBody'},
                            highlighter('B', formData.tuercas),
                            highlighter('R', formData.tuercas),
                            highlighter('M', formData.tuercas),
                            highlighter('N/A', formData.tuercas),
                            {text: '8.4', style: 'itemNumbers'},
                            {text: 'Siempre respetaré las normas de conducir', style: 'formBody', colSpan: 3},
                            {},
                            {},
                            highlighter('SI', formData.punto4_fatiga),
                            highlighter('NO', formData.punto4_fatiga),
                        ],
                        [
                            {text: '2.7', style: 'itemNumbers'},
                            {text: 'Kit de Invierno', style: 'formBody'},
                            highlighter('B', formData.kit_invierno),
                            highlighter('R', formData.kit_invierno),
                            highlighter('M', formData.kit_invierno),
                            highlighter('N/A', formData.kit_invierno),
                            {text: 'OBSERVACIONES', style: 'formTitle', colSpan: 6},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '2.8', style: 'itemNumbers'},
                            {text: 'Neumáticos de Repuesto', style: 'formBody'},
                            highlighter('B', formData.neumaticos_repuesto),
                            highlighter('R', formData.neumaticos_repuesto),
                            highlighter('M', formData.neumaticos_repuesto),
                            highlighter('N/A', formData.neumaticos_repuesto),
                            {text: `${formData.observaciones || 'N/A'}`, style: 'formBody', colSpan: 6, rowSpan: 7},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '3', style: 'formTitle'},
                            {text: 'LUCES', style: 'formTitle'},
                            {text: 'VERIFICACION', style: 'formTitle', colSpan: 4},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '3.1', style: 'itemNumbers'},
                            {text: 'Luces Traseras', style: 'formBody'},
                            highlighter('B', formData.luces_traseras),
                            highlighter('R', formData.luces_traseras),
                            highlighter('M', formData.luces_traseras),
                            highlighter('N/A', formData.luces_traseras),
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '3.2', style: 'itemNumbers'},
                            {text: 'Luces Delanteras', style: 'formBody'},
                            highlighter('B', formData.luces_delanteras),
                            highlighter('R', formData.luces_delanteras),
                            highlighter('M', formData.luces_delanteras),
                            highlighter('N/A', formData.luces_delanteras),
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '3.3', style: 'itemNumbers'},
                            {text: 'Luces Direccionales', style: 'formBody'},
                            highlighter('B', formData.luces_direccionales),
                            highlighter('R', formData.luces_direccionales),
                            highlighter('M', formData.luces_direccionales),
                            highlighter('N/A', formData.luces_direccionales),
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '3.4', style: 'itemNumbers'},
                            {text: 'Neblineros', style: 'formBody'},
                            highlighter('B', formData.neblineros),
                            highlighter('R', formData.neblineros),
                            highlighter('M', formData.neblineros),
                            highlighter('N/A', formData.neblineros),
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                        [
                            {text: '3.5', style: 'itemNumbers'},
                            {text: 'Estado Balizas', style: 'formBody'},
                            highlighter('B', formData.balizas),
                            highlighter('R', formData.balizas),
                            highlighter('M', formData.balizas),
                            highlighter('N/A', formData.balizas),
                            {},
                            {},
                            {},
                            {},
                            {},
                            {},
                        ],
                    ]
                }
            },

            {
                //ANOMALIAS
                style: 'anomalia',
                table: {
                    widths: ['*'],
                    body: [
                        [
                            { text: 'ANOMALIAS', fontSize: 10 ,alignment: 'center', bold: 'true'}
                        ],
                            ...((Array.isArray(arrayImages) ? arrayImages : [arrayImages]))
                            .map((i)=> [{
                                image: i.image,
                                width: i.width,
                                alignment: i.alignment,
                                margin: i.margin
                            }])
                        
                    ]
                }
            },

            {   //DECLARACIÓN JURADA
                table: {
                    widths: ['*'],
                    body: [
                        [
                            {text: [
                                {text: 'DECLARACIÓN JURADA: ', fontSize: 10, bold: true}, 
                                {text: '"Declaro bajo juramento que, las condiciones físicas y mecánicas que evalúo como responsable de la Camioneta, se realizaron con el criterio necesario para identificar desviaciones que pudieran causar incidentes o consecuencias graves por omisión o descuido, por lo que, estas condiciones reportadas, están conforme a la realidad del vehículo."', fontSize: 10}
                            ]}
                        ]
                    ]
                }
            },

            {   //FIRMA
                table: {
                    widths: ['*', 80, '*', 80],
                    body: [
                        [
                            {text: 'Firma: ', style: 'formTitleNoCenter'},
                            {text: 'Fecha: ', style: 'formTitleNoCenter'},
                            {text: 'Firma: ', style: 'formTitleNoCenter'},
                            {text: 'Fecha: ', style: 'formTitleNoCenter'}
                        ],
                        [
                            validateFirmas(formData.canvas_firma_cond),
                            {},
                            validateFirmas(formData.canvas_firma_acomp),
                            {}
                        ],
                        [
                            {text: `Nombre Conductor: ${formData.conductor || 'N/A'}`, colSpan: 2, style: 'formTitleNoCenter'},
                            {},
                            {text: `Nombre Acompañante: ${formData.acompanante || 'N/A'}`, colSpan: 2, style: 'formTitleNoCenter'},
                            {}
                        ],
                        [
                            {text: `Informado a: ${formData.input_informado || 'N/A'}`, colSpan: 2, style: 'formTitleNoCenter'},
                            {},
                            {text: `Cargo: ${formData.input_cargo || 'N/A'}`, colSpan: 2, style: 'formTitleNoCenter'},
                            {}
                        ]
                    ]
                }
            },
            
        ],

        styles: {
            header: {
                fontSize: 14,
                bold: true,
                marginBottom: 0,
                alignment: 'center',
            },
            formTitle: {
                fontSize: 9,
                bold: true,
                marginBottom: 5,
                alignment: 'center',
                margin: [0, 3, 0, 0]
            },
            formTitleNoCenter: {
                fontSize: 9,
                bold: true,
                marginBottom: 5
            },
            formBody: {
                fontSize: 8
            },
            item: {
                fontSize: 8,
                bold: true,
                marginBottom: 5,
                alignment: 'center'
            },
            options: {
                fontSize: 9,
                alignment: 'center'
            },
            options_highlighted: {
                fontSize: 9,
                alignment: 'center',
                fillColor: '#737373',
            },
            anomalias: {
                margin: [0, 15, 0, 15]
            },
            itemNumbers: {
                fontSize: 8,
                alignment: 'center'
            }
        },
    };

    
};



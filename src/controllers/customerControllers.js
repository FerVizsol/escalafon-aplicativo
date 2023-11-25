const controller = {};

//selects
controller.lugares = (req,res) =>{
    req.getConnection( (err,conn) =>{
        conn.query("CALL listar_lugarestudio()", (err,data) =>{
            if (err){
                res.json(err)
            }else{
                res.render('lugares',{
                    data
                })
            }
        })
    })
}

controller.inicio = (req,res)=> {
    req.getConnection((err,conn) =>{
        conn.query("CALL listar_docentes()",(err,lista) =>{
            if(err){
                res.json(err);
            }
            console.log(lista);
            res.render('inicio',{
                data:lista,
                busqueda : ""
            });
        })
    });
}

controller.busqueda = (req,res) =>{
    const busqueda = req.query.busqueda;
    req.getConnection((err,conn) =>{
        
        if([busqueda] == undefined){
            req.getConnection((err,conn) =>{
                conn.query("CALL listar_docentes()",(err,lista) =>{
                    if(err){
                        res.json(err);
                    }
                    res.render('inicio',{
                        data:lista,
                        busqueda : ""
                    });
                })
            });
        }
        conn.query("CALL buscar_docentes(?)",[busqueda],(err,lista) =>{
            if (err){
                res.render('inicio',{
                    data : [[{
                        numdoc : '',
                        nom : '',
                        cmodular : '',
                        claboral : '',
                        slaboral : ''
                    }
                ],{}],
                busqueda
                })
            }
            res.render('inicio',{
                data:lista,
                busqueda
            })
        });
    })
}

controller.verlegajo = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion1(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        res.render('seccion1',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}
controller.anadirdocente = (req,res) => {
    const {id} = req.params;
    res.render('anadir',{
        
    })
}
controller.anadirdocente2 = (req,res) => {
    const {id} = req.params;
    const{
        numdoc,
        nombre,
        appat,
        apmat,
        fechanac,
        sexo,
        estado,
        cargo,
        claboral,
        jlaboral,
        slaboral,
        neducativo,
        meducativa,
        codmodular,
        ubicacionfisica
    } = req.body;
    
    let sexo1 = sexo.substring(0,1)
    let estado1 = estado.substring(0,1);
    console.log({numdoc,
        nombre,
        appat,
        apmat,
        fechanac,
        sexo,
        estado,
        cargo,
        claboral,
        jlaboral,
        slaboral,
        neducativo,
        meducativa,
        codmodular,
        ubicacionfisica
    });
    const currentDate = new Date();

    const mes = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const anio = currentDate.getFullYear();
    const dia = currentDate.getDate().toString().padStart(2, '0');
    const diaFormato = `${anio}-${mes}-${dia}`;
    req.getConnection( (err,conn) => {
        conn.query("CALL CrearDocenteYLegajoPersonal(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[numdoc, nombre, appat,apmat,"DNI",sexo1,fechanac, null ,estado1,cargo,claboral,neducativo, cargo + " " +neducativo, meducativa, diaFormato , slaboral, jlaboral, codmodular, ubicacionfisica ],(err,resultado) =>{
            if (err){
                res.json(err);
            }else{
                conn.query("CALL listar_idiomas()",(err,idiomas) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        res.render('anadir2',{
                            id: numdoc,
                            idiomas: idiomas
                        })
                    }
                })
            }
        })
    })
}
controller.anadirdocente3 = (req, res) => {
    const { id } = req.params;
    const { codigoInstitucion, idiomas } = req.body;
    const idiomasArray = idiomas.split(',');
    const IdiomasArray = idiomasArray.map(item => item.split(' ')[0]);
    const codigoInstitucionArray = codigoInstitucion.split(',');

    const idiomaPromises = IdiomasArray.map(idioma => {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    conn.query("CALL InsertarIdiomaDocente(?, ?)", [idioma, id], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            });
        });
    });

    const codigoInstitucionPromises = codigoInstitucionArray.map(codigoInstitucionItem => {
        return new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    conn.query("CALL InsertarLugarEstudioDocente(?, ?)", [codigoInstitucionItem, id], (err, result) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                }
            });
        });
    });

    Promise.all([...idiomaPromises, ...codigoInstitucionPromises])
        .then(() => {
            res.render('docentecreado');
        })
        .catch((err) => {
            res.json(err);
        });
};


controller.editardocente = (req,res) => {
    const {id} = req.params;
    req.getConnection((err,conn) =>{
        conn.query("CALL info_editar_docente(?)",id,(err,data) =>{

            function formatDate(dateString) {
                const date = new Date(dateString);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
                const day = date.getDate().toString().padStart(2, '0');
                return `${year}-${month}-${day}`;
            }
            
            fechaNac = formatDate(data[0][0].fechaNac);
            fechaFalle = data[0].fechaFalle ? formatDate(data[0][0].fechaFalle) : '';
            res.render('editar',{
                id,
                data: data[0][0],
                fechaNac,
                fechaFalle
            })
        })
    })
    
}
controller.modificardocente = (req,res) =>{
    const{id} = req.params;
    const {
        nuevosNombres,
        nuevosApPat,
        nuevosApMat,
        nuevoEstadoCivil,
        nuevoSexo,
        nuevaFechaNac,
        nuevaFechaFalle,
    } = req.body;
    let NuevaFechaFalle = nuevaFechaFalle;
    if (nuevaFechaFalle == ''){
        NuevaFechaFalle = null;
    }
    console.log(id,nuevosNombres,nuevosApPat,nuevosApMat,'DNI',nuevoSexo,nuevaFechaNac,NuevaFechaFalle,nuevoEstadoCivil);
    req.getConnection( (err,conn) =>{
        conn.query("CALL ActualizarDocente(?,?,?,?,?,?,?,?,?)",[id,nuevosNombres,nuevosApPat,nuevosApMat,'DNI',nuevoSexo,nuevaFechaNac,NuevaFechaFalle,nuevoEstadoCivil], (err,result) =>{
            if (err){
                res.json(err)
            }else{
                console.log(result);
                res.render('editado')
            }
        })
    })
}
controller.eliminardocente = (req,res) => {
    const {id} = req.params;
    res.render('eliminar',{
        id : id
    })
}
controller.nuevaresolucion = (req,res) => {
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err)
            }else{
                res.render('nuevaresolucion',{
                    codPlaza : cod[0][0].codPlaza
                })
            }
        })
    })
    
}
controller.delete = (req,res) => {
    const {id} = req.params;
    console.log({id})
    req.getConnection((err,conn) =>{
        conn.query("CALL eliminar_docente(?)",[id], (err,data) =>{
            if (err){
                console.log(err.message)
            }else{
                res.render('eliminado')
            }
        })
    })
}

controller.ingresarresolucion = (req,res) => {
    const {codPlaza} = req.params;
    const{
        seccion,
        tresolucion,
        fechainicio,
        eresolucion,
        regimen,
        fechafin,
        motivo,
        accion,
        descripciones
    } = req.body;
    const fechaInicio = fechainicio ? fechainicio : null;
    const fechaFin = fechafin ? fechafin : null;
    req.getConnection((err,conn) =>{
        conn.query("CALL CrearResolucion(?,?,?,?,?,?,?,?,?)",[codPlaza,seccion,tresolucion,eresolucion,regimen,motivo,accion,fechaInicio,fechaFin],(err,nuevaclave) =>{
            if (err){
                res.json(err);
            }else{
                const descripcionArray = descripciones.split(";");
                for (let i = 0; i < descripcionArray.length; i++) {
                    const descripcion = descripcionArray[i];
                    conn.query("CALL CrearDescripcion(?, ?)", [nuevaclave[0][0].nuevaClave, descripcion], (err, result) => {
                        if (err) {
                            res.json(err);
                        }
                        console.log(result);
                    });
                }
                res.render('resolucioncreado')
            }
        })
    })

}

controller.seccion2 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion2(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion2',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion3 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion3(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion3',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}


controller.seccion4 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion4(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion4',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion5 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion5(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion5',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion6 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion6(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion6',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion7 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion7(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion7',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion8 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion8(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion8',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion9 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion9(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion9',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

controller.seccion10 = (req,res) =>{
    const {id} = req.params;
    req.getConnection( (err,conn) =>{
        conn.query("CALL Obtener_CodPlaza(?)",[id],(err,cod) =>{
            if(err){
                res.json(err);
            }else{
                
                let codPlaza = cod[0][0].codPlaza;
                conn.query("CALL listar_seccion10(?)",[codPlaza] , (err,data) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        console.log(data)
                        res.render('seccion10',{
                            id : id,
                            data : data
                        })
                    }
                })
            }
        })
    })
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('es-PE', options);
    return formattedDate;
}

controller.descripcion = (req,res) =>{
    const{numResolucion} = req.params;
    req.getConnection( (err,conn) => {
        conn.query("CALL MostrarResolucionCompleta(?)",[numResolucion],(err,data1) =>{
            if (err){
                res.json(err);
            }else{
                conn.query("CALL MostrarDescripciones(?)",[numResolucion],(err,data2) =>{
                    if (err){
                        res.json(err);
                    }else{
                        console.log(data1[0][0]);
                        data1[0][0].fechaInicio = formatDate(data1[0][0].fechaInicio);
                        data1[0][0].fechaFin = formatDate(data1[0][0].fechaFin);
                        res.render('descripcion',{
                            numResolucion,
                            data1,
                            data2
                        })
                    }
                })
            }
        })
    })
    
}
controller.reporteescalafonario = (req,res) =>{
    const id = req.params.id;
    const reporteopcion = req.query.reporte;
    if(reporteopcion == '1'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeInhabilitacion(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '2'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeCesePermanente(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '3'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeCeseTemporal(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '4'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeDestitucion(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '5'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeVacaciones(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '6'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeRetencionesJudiciales(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '7'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeReingresoCarreraMagisterial(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '8'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL informeSubsidioLuto(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
    if(reporteopcion == '9'){
        req.getConnection( (err,conn) =>{
            conn.query("CALL Obtener_CodPlaza(?)",[id],(err,codPlaza) =>{
                if(err){
                    res.json(err)
                }else{
                    conn.query("CALL reporteHojaVida(?)",[codPlaza[0][0].codPlaza],(err,data) =>{
                        if (err){
                            res.json(err);
                        }else{
                            if (data[0].length == 0){
                                console.log(data[0]);
                                res.render('noReporte')
                            }else{
                                console.log(data[0]);
                                res.render('Reporte',{
                                    reporteopcion,
                                    data : data[0]
                                })
                            }
                        }
                    })
                }
            })
        })
    }
}

module.exports = controller;

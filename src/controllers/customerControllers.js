const controller = {};

//selects
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
        meducativa
    } = req.body;
    if(sexo == "Masculino"){
        sexo : "M"
    }else{
        sexo : "F"
    }
    estado : estado.substring(0,1);
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
        meducativa});
    req.getConnection( (err,conn) => {
        conn.query("CALL CrearDocenteYLegajoPersonal(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",[numdoc, nombre, appat,apmat,"DNI",sexo,fechanac,"null",estado,cargo,claboral,neducativo, cargo + " " +neducativo, meducativa, "CURDATE()", slaboral, jlaboral,  ],(err,resultado) =>{
            if (err){
                res.json(err);
            }else{
                conn.query("CALL listar_idiomas()",(err,idiomas) =>{
                    if (err){
                        res.json(err);
                        controller.inicio();
                    }else{
                        res.render('anadir2',{
                            id: id,
                            idiomas: idiomas
                        })
                    }
                })
            }
        })

        
    })
}

controller.editardocente = (req,res) => {
    const {id} = req.params;
    res.render('editar',{

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
    res.render('nuevaresolucion',{
        id : id
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
    const {id} = req.params;
    req.getConnection((err,conn) =>{
        conn.query("CALL crear_resolucion(?,?,?)")
    })
    res.render('resolucioncreada')
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
module.exports = controller;

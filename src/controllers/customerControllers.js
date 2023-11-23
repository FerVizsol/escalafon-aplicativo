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
    res.render('legajo',{
        
    })
}
controller.anadirdocente = (req,res) => {
    const {id} = req.params;
    res.render('anadir',{

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
module.exports = controller;
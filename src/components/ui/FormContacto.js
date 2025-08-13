import React, { useContext, useRef, useEffect, useState } from "react";
import {
    Button,
    Form,
    Input,
    Select,
    DatePicker,
} from "antd";
import FormItem from "antd/es/form/FormItem";
import dayjs from "dayjs";
import { GlobalContext } from "../context/GlobalContext";
import './FormContacto.css';


function FormContacto({ editarContactoValues }) {

    const URL = process.env.REACT_APP_URL;
    const formRef = useRef(null);
    const idUserLogged = localStorage.getItem("usuario");
    const { TextArea } = Input;

    const { setDrawerNuevoContacto, actualizarTableData, setActualizarTableData, setDrawerEditarContacto } = useContext(GlobalContext);

    const [contacto, setContacto] = useState({
        nombre: "",
        email: "",
        fechaNac: "", //cuidado recordar que puede ser null y no mandar en append.
        telefono: "",
        movil: "",
        //domicilio: "",
        descripcion: "",
        idCliente: "",
        idRol: ""
    });
    const [dataClientes, setDataClientes] = useState([]);
    const [optionsRoles, setOptionsRoles] = useState([]);
    const [enableSelectRol, setEnableSelectRol] = useState(false);
    const dateFormat = "DD/MM/YYYY";

    useEffect(() => {

        const dataForm = new FormData();
        dataForm.append("idU", idUserLogged);

        const requestOptions = {
            method: 'POST',
            body: dataForm
        };

        const fetchDataClientesxUser = async () => {
            const data = await fetch(`${URL}selectClientesxUser.php`, requestOptions);
            const jsonData = await data.json();
            setDataClientes(jsonData);
        }

        fetchDataClientesxUser()
            .catch(console.error);;

        if (editarContactoValues) {
            formRef.current.setFieldsValue({
                nombre: editarContactoValues.nombre,
                email: editarContactoValues.email,
                fechaNac: editarContactoValues.fechaNac && dayjs(editarContactoValues.fechaNac, dateFormat),
                telefono: editarContactoValues.telefono,
                movil: editarContactoValues.movil,
                descripcion: editarContactoValues.descripcion,
                //domicilio: "",
                //idCliente: editarContactoValues.idCliente,
                // idRol: editarContactoValues.id
            });
            //Asigno en el state para luego reutilizarlo a la hora de editar, en caso contrario causa conflictos por el formato que devuelve el datePicker de ant en el primer parametro.
            setContacto(prev => ({ ...prev, fechaNac: editarContactoValues.fechaNac }));
            //console.log(editarContactoValues)
        }

        //console.log(editarContactoValues)
    }, []);


    const optionsCliente = dataClientes.map((cliente) => ({
        value: cliente.cli_id,
        label: cliente.cli_nombre,
    }));


    //Funcion que crea un NUEVO contacto
    const crearContacto = async () => {
        console.log('Intentando guardar')
        console.log(contacto)
        const data = new FormData();
        data.append("nombre", contacto.nombre.toUpperCase());
        data.append("email", contacto.email);
        contacto.fechaNac && data.append("fechanac", contacto.fechaNac);
        data.append("telefono", contacto.telefono);
        data.append("movil", contacto.movil);
        data.append("descrip", contacto.descripcion);
        //data.append("domicilio", contacto.domicilio ? contacto.domicilio : 0);
        contacto.idCliente && data.append("idCli", contacto.idCliente);
        contacto.idRol && data.append("idRol", contacto.idRol);

        const requestOptions = {
            method: 'POST',
            body: data
        };
        const response = await fetch(`${URL}con_crearcontacto.php?usuid=${idUserLogged}`, requestOptions);
        console.log(response);
        setDrawerNuevoContacto(false);
        setActualizarTableData(!actualizarTableData);
    };

    //Funcion que MODIFICA contacto
    const editarContacto = async (values) => {
        console.log('Tratando de editar');
        console.log(values);


        const data = new FormData();
        data.append("idContacto", editarContactoValues.key);
        data.append("nombre", values.nombre.toUpperCase());
        data.append("email", values.email);


        values.fechaNac && data.append("fechanac", contacto.fechaNac);
        !values.fechaNac && data.append("fechanac", 'null'); //Cuando presionamos la x en el date picker para dejarlo sin fecha y asi poder borrarla

        // values.fechaNac && console.log('Existe fechaNac')
        // !values.fechaNac && console.log('NOOOO Existe fechaNac')

        data.append("tel", values.telefono);
        data.append("mov", values.movil);
        data.append("descripcion", values.descripcion);
        //data.append("domicilio", values.domicilio ? values.domicilio : 0);
        //contacto.idCliente && data.append("newc_cuenta", contacto.idCliente);
        //contacto.idRol && data.append("newc_conta", contacto.idRol);

        const requestOptions = {
            method: 'POST',
            body: data
        };
        const response = await fetch(`${URL}clientView_guardarEditContactoNoRol.php`, requestOptions);
        console.log(response);
        setDrawerEditarContacto(false);
        setActualizarTableData(!actualizarTableData);
    };

    const handleChange = (e, fecha) => {
        //console.log(e, fecha);
        (!fecha & fecha !== '') && setContacto(prev => ({ ...prev, [e.target.name]: e.target.value }));
        fecha && setContacto(prev => ({ ...prev, fechaNac: fecha }));
        e == null && setContacto(prev => ({ ...prev, fechaNac: undefined }));
    };

    const handleChangeCliente = (e) => {
        setEnableSelectRol(true);
        setContacto(prev => ({ ...prev, idCliente: e }));
        //Carga los roles en su respectivo select una vez seleccionamos un cliente
        fetchRoles();
    };

    const fetchRoles = async () => {
        try {

            const data = await fetch(`${URL}con_roles.php`);
            const jsonData = await data.json();

            const optionsRoles = jsonData.map((rol) => ({
                value: rol.rol_id,
                label: rol.rol_desc
            }));
            setOptionsRoles(optionsRoles);

        } catch (err) { console.log(err) };
    };


    return (
        <>
            <Form
                layout="vertical"
                ref={formRef}
                onFinish={editarContactoValues ? editarContacto : crearContacto}
                autoComplete="off"
            >
                <div className="contenedor-inputs-formContacto">

                    <FormItem name="nombre" className="formItem-style" label="Nombre"
                        hasFeedback
                        rules={[{
                            required: true,
                            message: "Ingrese nombre/s y/o apellido/s válidos",
                            pattern: new RegExp("^([ \u00c0-\u01ffa-zA-Z'])+$")
                        }]}>
                        <Input name="nombre" className='input-style' onChange={handleChange} />
                    </FormItem>

                    <FormItem name="email" className="formItem-style" label="Email"
                        hasFeedback
                        rules={[{
                            // required: true,
                            message: "Ingrese un mail válido",
                            pattern: new RegExp(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                            )
                        }]}>
                        <Input name="email" className='input-style' onChange={handleChange} />
                    </FormItem>

                    <Form.Item name="fechaNac" className="formItem-style" label="Fecha de nacimiento"
                        hasFeedback
                        rules={[{
                            required: false
                        }]}>
                        <DatePicker name="fechaNac" format={dateFormat} className='input-style' onChange={handleChange} />
                    </Form.Item>

                    <FormItem name="telefono" className="formItem-style" label="Teléfono"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese un teléfono válido",
                            pattern: new RegExp(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)
                        }]}>
                        <Input name="telefono" className='input-style' onChange={handleChange} />
                    </FormItem>

                    <FormItem name="movil" className="formItem-style" label="Móvil"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Ingrese un móvil válido",
                            pattern: new RegExp(/^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/)
                        }]}>
                        <Input name="movil" className='input-style' onChange={handleChange} />
                    </FormItem>

                    {/* <FormItem name="domicilio" className="formItem-style" label="Domicilio"
                        hasFeedback
                        rules={[{
                            required: false,
                            //message: "Ingrese solo números",
                            //pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <Input className='input-style' onChange={handleChange} />
                    </FormItem> */} 

                    <FormItem name="descripcion" className="formItem-style" label="Descripcion"
                        hasFeedback
                        rules={[{
                            required: false,
                            //message: "Ingrese solo números",
                            //pattern: new RegExp('^[0-9]+$')
                        }]}>
                        <TextArea name="descripcion" rows={4} maxLength={255} className='input-style' onChange={handleChange} />
                    </FormItem>


                    {!editarContactoValues ? <FormItem style={{ width: '250px' }} name="idCliente" className="formItem-style" label="Cliente"
                        hasFeedback
                        rules={[{
                            required: false,
                            message: "Seleccione un cliente"
                        }]}>
                        <Select
                            showSearch
                            className='input-style'
                            placeholder="Selecciona un cliente"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input.toUpperCase().trim())}
                            options={optionsCliente}
                            onChange={handleChangeCliente}
                            name="idCliente"
                        />
                    </FormItem> : ''}

                    {enableSelectRol ? <FormItem style={{ width: '250px' }} name="idRol" className="formItem-style" label="Rol"
                        hasFeedback
                        rules={[{
                            required: true,
                            message: "Seleccione un rol"
                        }]}>
                        <Select
                            showSearch
                            className='input-style'
                            placeholder="Selecciona un rol"
                            optionFilterProp="children"
                            filterOption={(input, option) => (option?.label ?? '').includes(input)}
                            options={optionsRoles.length > 0 ? optionsRoles : ''}
                            onChange={(e) => setContacto(prev => ({ ...prev, idRol: e }))}
                            name="idRol"
                        />
                    </FormItem> : ''}



                </div>
                <Button
                    type="primary"
                    htmlType="submit"
                    className='btn-guardar'
                >GUARDAR</Button>
            </Form>
        </>
    )
}

export default FormContacto
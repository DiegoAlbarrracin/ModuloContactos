import React, { useContext, useEffect, useState } from "react";
import {
    Button,
    Drawer,
    Table,
    Modal,
    Divider,
    Row,
    Col,
    Input,
    App
} from "antd";
import {
    EditOutlined,
    EyeOutlined,
    CloseOutlined,
    SearchOutlined,
    MailOutlined,
    CalendarOutlined,
    PhoneOutlined,
    MobileOutlined,
    UserOutlined
} from "@ant-design/icons";
import dayjs from "dayjs";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import "./TablaContactos.css";
import { GlobalContext } from "../context/GlobalContext";
import FormContacto from "./FormContacto";

function TablaContactos() {
    const { message } = App.useApp();

    const URL = process.env.REACT_APP_URL;
    const dateFormat = "DD/MM/YYYY";

    const { drawerNuevoContacto, setDrawerNuevoContacto, drawerEditarContacto, setDrawerEditarContacto, actualizarTableData } = useContext(GlobalContext);

    const [dataContactos, setDataContactos] = useState([]);
    //const [tableData, setTableData] = useState([]);
    const [contacto, setContacto] = useState(0);
    const [open, setOpen] = useState(false);
    const [searchedText, setSearchedText] = useState('');

    useEffect(() => {

        const fetchDataContactos = async () => {
            const data = await fetch(`${URL}con_master.php`);
            const jsonData = await data.json();
            setDataContactos(jsonData);
        }

        fetchDataContactos()
            .catch(console.error);;


    }, [actualizarTableData]);


    //Columnas Ant Design 
    const columns = [
        {
            title: "NOMBRE",
            dataIndex: "nombre",
            key: "nombre",
            align: "left",
            sorter: {
                compare: (a, b) => a.nombre.localeCompare(b.nombre),
            },
            onFilter: (value, record) => {
                return String(record.nombre).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.email).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.telefono).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.movil).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.domicilio).toUpperCase().trim().includes(value.toUpperCase().trim()) ||
                    String(record.propietario).toUpperCase().trim().includes(value.toUpperCase().trim());
            },
            filteredValue: [searchedText]
        },
        {
            title: "EMAIL",
            dataIndex: "email",
            key: "email",
            align: "left",
            sorter: {
                compare: (a, b) => a.email.localeCompare(b.email),
            },
        },
        {
            title: "TELEFONO",
            dataIndex: "telefono",
            key: "telefono",
            align: "left"
        },
        {
            title: "MOVIL",
            dataIndex: "movil",
            key: "movil",
            align: "left"
        },
        // {
        //     title: "DOMICILIO",
        //     dataIndex: "domicilio",
        //     key: "domicilio",
        //     align: "left",
        //     sorter: {
        //         compare: (a, b) => a.domicilio?.localeCompare(b.domicilio),
        //     },
        // },
        {
            title: "FECHA NACIMIENTO",
            dataIndex: "fechaNac",
            key: "fechaNac",
            align: "center",
            sorter: {
                compare: (a, b) =>
                    dayjs(a.fechaNac, "DD-MM-YYYY") - dayjs(b.fechaNac, "DD-MM-YYYY"),
            },
        },
        {
            title: "...",
            key: "acciones",
            align: "center",
            render: (fila) => {
                return (
                    <>
                        <div className="btn-contenedor">
                            <EyeOutlined className="icon-color" onClick={() => seleccionarContacto(fila, 'verDetalle')} />
                            <EditOutlined className="icon-color" onClick={() => seleccionarContacto(fila, 'editar')} />
                        </div>
                    </>
                );
            },
        }
    ];

    const CustomCloseIcon = () => (
        <div className="drawer-close-icon">
            <CloseOutlined />
        </div>
    );

    //Asigna el valor de la fila al presionar editar
    const seleccionarContacto = (fila, accion) => {
        setContacto(fila);
        if (accion === 'editar') setDrawerEditarContacto(true);
        if (accion === 'verDetalle') setOpen(true);
    };

    const tableData = dataContactos.map((Contacto, index) => ({
        index: index,

        key: Contacto.con_id,
        nombre: Contacto.con_nombre,
        email: Contacto.con_email,
        telefono: Contacto.con_telefono,
        movil: Contacto.con_movil,
        fechaNac: Contacto.con_fechanac,
        descripcion: Contacto.con_desc
        //propietario: Contacto.usu_nombre,
        //domicilio: Contacto.con_domicilio,

    }));

    //Notificacion al copiar en modal 
    const showMessage = () => {
        message.success('Copiado!');
    };

    return (
        <>

            <div className="div-boton">
                <h3 className="titulo-modulo">CONTACTOS</h3>
                <div className="buscador-btn-contenedor">
                    <Input placeholder="Buscar..." className="buscador"
                        suffix={
                            <SearchOutlined className="search-icon" />
                        }
                        onChange={(e) => {
                            setSearchedText(e.target.value);
                        }}
                    />
                    <Button type="primary" className="btn-flat" onClick={() => setDrawerNuevoContacto(true)}>NUEVO CONTACTO</Button>
                </div>
            </div>


            <Table
                size={"small"}
                dataSource={tableData}
                columns={columns}
                pagination={{
                    position: ["none", "bottomRight"],
                    showSizeChanger: false
                }}
            />

            <Drawer
                title="Nuevo contacto"
                open={drawerNuevoContacto}
                onClose={() => setDrawerNuevoContacto(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FormContacto />
            </Drawer>

            <Drawer
                title="Editar contacto"
                open={drawerEditarContacto}
                onClose={() => setDrawerEditarContacto(false)}
                width={320}
                closeIcon={<CustomCloseIcon />}
                destroyOnClose={true}
            >
                <FormContacto editarContactoValues={contacto} />
            </Drawer>


            <App>
            <Modal
                title={
                    <div className="contenedor-titulo-modal">
                        <div className="contacto-modal"><UserOutlined /> {contacto.nombre}</div>
                    </div>
                }

                centered
                open={open}
                onOk={() => setOpen(false)}
                onCancel={() => setOpen(false)}
                width={600}
                footer={[
                    <Button
                        key="btnAceptarModal"
                        type="primary"
                        onClick={() => setOpen(false)}
                        className="btn-flat"
                    >
                        Aceptar
                    </Button>,
                ]}
            >
                <Divider className="divider-style" />

                <div className="body-modal">

                    <Row className="card-row">
                        <Col xs={24} sm={12} md={6} className="col-card">
                            
                                <MailOutlined className="icon-size" />
                                <div className="name-card">EMAIL</div>

                            <CopyToClipboard text={contacto.email} >
                                    <div className="data" onClick={showMessage} >{contacto.email}</div>
                            </CopyToClipboard>

                        </Col>
                        <Col xs={24} sm={12} md={6} className="col-card">

                            <CalendarOutlined className="icon-size" />
                            <div className="name-card">EDAD</div>
                            {contacto.fechaNac ? 
                                <CopyToClipboard text= {contacto.fechaNac}>

                                    <div className="data" onClick={showMessage} >{dayjs().diff((dayjs(contacto.fechaNac, dateFormat)), 'year')} <div style={{ color: 'black', marginLeft: '8px' }}> ({contacto.fechaNac})</div></div>
                                </CopyToClipboard> : ''}

                        </Col>

                    </Row>
                    <Divider className="divider-style" />
                    <Row className="card-row">
                        <Col xs={24} sm={12} md={6} className="col-card">

                            <PhoneOutlined className="icon-size" />
                            <div className="name-card">TELEFONO</div>
                            <CopyToClipboard text= {contacto.telefono} >
                                <div className="data" onClick={showMessage} >{contacto.telefono}</div>
                            </CopyToClipboard>

                        </Col>
                        <Col xs={24} sm={12} md={6} className="col-card">

                            <MobileOutlined className="icon-size" />
                            <div className="name-card">MOVIL</div>
                            <CopyToClipboard text= {contacto.movil} >
                                <div className="data" onClick={showMessage} >{contacto.movil}</div>
                            </CopyToClipboard>

                        </Col>

                    </Row>
                </div>
            </Modal>
            </App>
           
        </>
    )
}

// Exporto este componente envuelto en tags App de Ant design para poder hacer correcto uso del componente message.
export default () => (
    <App>
      <TablaContactos />
    </App>
);
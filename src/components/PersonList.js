import './PersonList.css';
import {Component} from "react";
import {findPerson, getPersons} from "../api/APIUtils";
import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Col, Modal, ModalBody, ModalFooter, ModalHeader,
    Row
} from 'reactstrap';
import {
    Spinner,
    Button,
    Form
} from "react-bootstrap";
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";
import phone from "../img/phone.png"
import mail from "../img/mail.png"


export class PersonList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false,
            serverError: false,
            card: 0,
            toggle: false,
            input: ""
        }
        this.loadUsers = this.loadUsers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.toggle = this.toggle.bind(this);
        this.refreshUsers = this.refreshUsers.bind(this);
    }

    loadUsers() {
        this._isMounted && this.setState({
            isLoading: true
        });
        getPersons()
            .then(response => {
                this._isMounted && this.setState({
                    user: response,
                    isLoading: false
                });
            })
            .catch(error => {
            if(error.status === 404) {
                this._isMounted && this.setState({
                    notFound: true,
                    isLoading: false
                });
            } else {
                this._isMounted && this.setState({
                    serverError: true,
                    isLoading: false
                });
            }
        });
    }

    handleInputChange (event) {
        this._isMounted && this.setState({
            input: event.target.value,
        });
    }

    refreshUsers () {
        if (this.state.input !== "") {
            this._isMounted && this.setState({
                isLoading: true
            });
            findPerson(this.state.input)
                .then(response => {
                    this._isMounted && this.setState({
                        user: response,
                        isLoading: false
                    });
                })
                .catch(error => {
                    if (error.status === 404) {
                        this._isMounted && this.setState({
                            notFound: true,
                            isLoading: false
                        });
                    } else {
                        this._isMounted && this.setState({
                            serverError: true,
                            isLoading: false
                        });
                    }
                });
        } else
            this.loadUsers()
        this.setState({input: ""})
    }

    toggle(user) {
        this._isMounted && this.setState({
            card: typeof user === "object" ? this.state.card : user,
            toggle: !this.state.toggle
        });
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render () {
        if(this.state.user == null) {
            this.loadUsers()
        }

        if(this.state.isLoading) {
            return <Spinner animation="grow" />;
        }

        if(this.state.notFound) {
            return <NotFound/>;
        }

        if (this.state.serverError) {
            return <ServerError/>;
        }

        return (
            this.state.user ? (
                <Col>
                    <Row style={{width: 'auto', marginRight: '0%', marginLeft: '0%'}}>
                        <Form className="search-bar" onSubmit={this.refreshUsers}>
                            <Form.Control onChange={(event) => {
                                this.handleInputChange(event)
                            }}/>
                            <Button variant="primary" type="submit">
                                {/*<img src={search} width={25} height={25} alt='Search' className='search-image'/>*/}
                                Button
                            </Button>
                        </Form>
                    </Row>
                    <div className="card-grid">
                        {
                            Object.keys(this.state.user).map(
                                user =>
                                    <Card className="card" id={user}
                                          onClick={event => this.toggle(event.currentTarget.id)}>
                                        <CardHeader style={{
                                            marginLeft: "15px",
                                            marginTop: "25px",
                                            marginBottom: "30px",
                                            fontSize: "18px"
                                        }}>
                                            <b>{this.state.user[user].name}</b>
                                        </CardHeader>
                                        <CardBody className="card-body">
                                            <Row style={{marginBottom: "15px", display: "flex"}}>
                                                <img style={{marginRight: "8px", height: "100%"}} src={phone} alt='Phone'/>
                                                <p style={{margin: 0}}>{this.state.user[user].phone}</p>
                                            </Row>
                                            <Row
                                                style={{textDecorationLine: "underline", display: "flex"}}>
                                                <img style={{marginRight: "8px", height: "100%", width: "20px"}} src={mail} alt='Email'/>
                                                <p style={{margin: 0}}>{this.state.user[user].email}</p>
                                            </Row>
                                        </CardBody>
                                        <CardFooter>

                                        </CardFooter>
                                    </Card>
                            )
                        }
                    </div>
                    <Modal isOpen={this.state.toggle} toggle={this.toggle}>
                        <Row style={{textAlign: "center", height: "20px"}}>
                            <Button className="dot" type="reset" variant="primary" onClick={this.toggle}></Button>
                        </Row>
                        <ModalHeader style={{
                            fontSize: "24px",
                            marginLeft: "10px"
                        }}>{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].name}</ModalHeader>
                        <ModalBody>
                            <Row className="modal-row">
                                <Col style={{width: "50%"}}>
                                    <p className="person-info">Телефон:</p>
                                </Col>
                                <Col style={{width: "50%"}}>
                                    <p className="person-info-data" style={{textDecorationLine: "underline"}}>{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].phone}</p>
                                </Col>
                            </Row>
                            <Row className="modal-row">
                                <Col style={{width: "50%"}}>
                                    <p className="person-info">Почта:</p>
                                </Col>
                                <Col style={{width: "50%"}}>
                                    <p className="person-info-data" style={{textDecorationLine: "underline"}}>{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].email}</p>
                                </Col>
                            </Row>
                            <Row className="modal-row">
                                <Col style={{width: "50%"}}>
                                    <p className="person-info">Дата приема:</p>
                                </Col>
                                <Col style={{width: "50%"}}>
                                    <p className="person-info-data">{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].hire_date}</p>
                                </Col>
                            </Row>
                            <Row className="modal-row">
                                <Col style={{width: "50%"}}>
                                    <p className="person-info">Должность:</p>
                                </Col>
                                <Col style={{width: "50%"}}>
                                    <p className="person-info-data">{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].position_name}</p>
                                </Col>
                            </Row>
                            <Row className="modal-row">
                                <Col style={{width: "50%"}}>
                                    <p className="person-info">Подразделение:</p>
                                </Col>
                                <Col style={{width: "50%"}}>
                                    <p className="person-info-data">{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].department}</p>
                                </Col>
                            </Row>
                        </ModalBody>
                        <ModalFooter style={{justifyContent: "flex-start", marginLeft: "10px"}}>
                            <Col>
                            <p style={{marginTop: "0px"}}>Дополнительная информация:</p>
                            <p style={{marginBottom: "10px"}} className="person-info-data">Разработчики используют текст Lorem ipsum в качестве заполнителя макета страницы. Так как дополнительной информации в JSON нет, а адрес нигде не используется закинул его сюда: {typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].address}</p>
                            </Col>
                        </ModalFooter>
                    </Modal>
                </Col>
            ) : null
        )
    }
}
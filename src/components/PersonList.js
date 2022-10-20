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
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";


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
                                Button
                            </Button>
                        </Form>
                        <Col style={{
                            backgroundColor: 'white',
                            borderRadius: 0,
                            overflow: 'auto',
                            height: '100%',
                            paddingBottom: 0,
                            width: '10%'
                        }}>
                            {/*<img src={search} width={25} height={25} alt='Search' className='search-image'/>*/}
                        </Col>
                    </Row>
                    <div className="card-grid">
                        {
                            Object.keys(this.state.user).map(
                                user =>
                                    <Card className="card" id={user}
                                          onClick={event => this.toggle(event.currentTarget.id)}>
                                        <CardHeader>
                                            {this.state.user[user].name}
                                        </CardHeader>
                                        <CardBody className="card-body">
                                            <Row>{this.state.user[user].phone}</Row>
                                            <Row
                                                style={{textDecorationLine: "underline"}}>{this.state.user[user].email}</Row>
                                        </CardBody>
                                        <CardFooter>

                                        </CardFooter>
                                    </Card>
                            )
                        }
                    </div>
                    <Modal isOpen={this.state.toggle} toggle={this.toggle}>
                        <Button color="primary" onClick={this.toggle}>Cancel</Button>
                        <ModalHeader>{typeof this.state.user[this.state.card] !== 'undefined' && this.state.user[this.state.card].name}</ModalHeader>
                        <ModalBody>

                        </ModalBody>
                        <ModalFooter>
                            Дополнительная информация
                        </ModalFooter>
                    </Modal>
                </Col>
            ) : null
        )
    }
}
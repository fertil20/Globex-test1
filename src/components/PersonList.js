import './PersonList.css';
import {Component} from "react";
import {findPerson, getPersons} from "../api/APIUtils";
import {Button, Col, Form, Input, ListGroup, ListGroupItem, Row} from 'reactstrap';
import NotFound from "../common/NotFound";
import ServerError from "../common/ServerError";

export class PersonList extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: null,
            isLoading: false
        }
        this.loadUsers = this.loadUsers.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    loadUsers(id) {
        this._isMounted && this.setState({
            isLoading: true
        });

        findPerson("fer")
            .then(async response => {
                this._isMounted && this.setState({
                    user: response,
                    isLoading: false
                });
                let byName = await this.state.user.slice(0);
                byName.sort(function(a, b) {
                    let x = a.name.toLowerCase();
                    let y = b.name.toLowerCase();
                    return x < y ? -1 : x > y ? 1 : 0;
                });
                this.setState({user: byName})

            }).catch(error => {
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

    handleInputChange(event) {
        const target = event.target;
        const inputName = target.name;
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
            }
        });
    }

    componentDidMount() {
        this._isMounted = true;
        this._isMounted && this.loadUsers();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render (){
        if(this.state.isLoading) {
            return <div className="text-center">
                <div className="spinner-border" role="status">
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        }

/*        if(this.state.notFound) {
            return <NotFound/>;
        }

        if(this.state.serverError) {
            return <ServerError/>;
        }*/

        return (
            <Row>
                {/*<NavigationPanel/>*/}
                <Col style={{backgroundColor:'white', borderRadius:10,overflow: 'auto', height:'100%', paddingBottom:20, width: '85%'}}>
                    {/*<div>*/}
                    {/*    <Form>*/}
                    {/*        <Row style={{width:'auto', marginRight: '0%', marginLeft: '0%'}}>*/}
                    {/*            <Col style={{backgroundColor:'white', borderRadius:0,overflow: 'auto', height:'100%', paddingBottom:0, width: 'auto'}}>*/}
                    {/*                <Input placeholder='Поиск'*/}
                    {/*                       className='search-bar'*/}
                    {/*                       id="FIO" name='FIO' type='text'*/}
                    {/*                       value={this.state.FIO.value}*/}
                    {/*                       onChange={(event) => {this.handleInputChange(event)}}*/}
                    {/*                /></Col>*/}
                    {/*            <Col style={{backgroundColor:'white', borderRadius:0,overflow: 'auto', height:'100%', paddingBottom:0, width: '10%'}}>*/}
                    {/*                <img src={{}} width={25} height={25} alt='Search' className='search-image'/>*/}
                    {/*            </Col>*/}
                    {/*        </Row>*/}
                    {/*    </Form>*/}
                    {/*</div>*/}
                    {
                        this.state.user ? (
                            <div style={{marginRight: '1%', marginLeft: '1%', overflowX: 'auto'}}>
                                <ListGroup horizontal className='table-top-line' key={"TABLE"}>
                                    <ListGroupItem style={{width:'10%', overflowX: 'auto'}} key={"ID"}>ID</ListGroupItem>
                                    <ListGroupItem style={{width:'20%', overflowX: 'auto'}} key={"USERNAME"}>Имя пользователя</ListGroupItem>
                                    <ListGroupItem style={{width:'20%', overflowX: 'auto'}} key={"FIO"}>ФИО</ListGroupItem>
                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={"CONTACTS"}>Почта</ListGroupItem>
                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={"DEL"}></ListGroupItem>
                                </ListGroup>
                                {
                                    Object.keys(this.state.user).map(
                                        user =>
                                            <div>
                                                <ListGroup horizontal className='table-top-line' key={user.id}>
                                                    <ListGroupItem style={{width:'10%', overflowX: 'auto'}} key={user.id+'.1'}>{this.state.user[user].id}</ListGroupItem>
                                                    <ListGroupItem style={{width:'20%', overflowX: 'auto'}} key={user.id+'.2'}>{this.state.user[user].username}</ListGroupItem>
                                                    <ListGroupItem style={{width:'20%', overflowX: 'auto', color: '#0a58ca'}} key={this.state.user[user].name+'.3'} tag = 'a' href={`/users/${this.state.user[user].username}`}>{this.state.user[user].name}</ListGroupItem>
                                                    <ListGroupItem style={{width:'25%', overflowX: 'auto'}} key={user.id+'.4'}>{this.state.user[user].email}</ListGroupItem>
                                                </ListGroup>
                                            </div>
                                    )
                                }
                            </div>
                        ):null
                    }
                </Col>
            </Row>
        )
    }
}
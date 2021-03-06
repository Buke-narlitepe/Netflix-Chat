import React from "react";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Logo from "./Logo.js";
import axios from "./axios.js";
import ProfilePic from "./ProfilePic.js";
import Uploader from "./Uploader.js";
import Profile from "./Profile.js";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Movies from "./Movies";
import Friends from "./Friends";
import Chat from "./Chat";
import PrivateChat from "./PrivateChat";
import Welcome from "./Welcome";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            firstname: "",
            lastname: "",
            bio: "",
            profilePic: undefined,
            uploaderVisible: false,
        };
        this.toggleUploader = this.toggleUploader.bind(this);
        this.setBio = this.setBio.bind(this);
        this.setImage = this.setImage.bind(this);
        this.closeComponent = this.closeComponent.bind(this);
    }

    componentDidMount() {
        axios.get("/api/user").then((data) => {
            console.log(data, "kekwef");
            this.setState({
                profilePic: data.data.image,
                firstname: data.data.firstname,
                lastname: data.data.lastname,
                bio: data.data.bio,
                email: data.data.email,
            });
        });
        console.log("FORM SUBMITTED", this.state);
    }

    toggleUploader() {
        this.setState({
            uploaderVisible: !this.state.uploaderVisible,
        });
    }

    setImage(data) {
        this.setState({
            profilePic: data,
        });
    }

    setBio(data) {
        this.setState({ bio: data });
    }

    closeComponent() {
        this.setState({
            uploaderVisible: false,
        });
    }

    handleClick() {
        axios.post("/logout").then(() => {
            location.replace("/welcome");
        });
    }

    render() {
        if (!this.state.email) return null;
        console.log(this.state);
        return (
            <React.Fragment>
                <BrowserRouter>
                    <header>
                        <Logo />
                        <div className="links">
                            <Link to="/users"> Find People</Link>
                            <span className="space">|</span>
                            <Link to="/"> Your Profile</Link>
                            <span className="space">|</span>
                            <Link to="/chat"> Chat</Link>
                            <span className="space">|</span>
                            <Link to="/friends-wannabes"> Friends</Link>
                            <span className="space">|</span>
                            <Link to="/movie/popular"> IMDB Top 250</Link>
                            <span className="space">|</span>
                            <a id="nav-link" onClick={this.handleClick}>
                                Log out
                            </a>
                        </div>
                        <ProfilePic
                            profilePic={this.state.profilePic}
                            toggleUploader={this.toggleUploader}
                        />
                    </header>
                    <Uploader
                        closeComponent={this.closeComponent}
                        setImage={this.setImage}
                        uploaderVisible={this.state.uploaderVisible}
                    />
                    <React.Fragment>
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    firstname={this.state.firstname}
                                    lastname={this.state.lastname}
                                    bio={this.state.bio}
                                    profilePic={this.state.profilePic}
                                    toggleUploader={this.toggleUploader}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route path="/user/:id" component={OtherProfile} />
                        <Route path="/users" component={FindPeople} />
                        <Route path="/movie/popular" component={Movies} />
                        <Route path="/friends-wannabes" component={Friends} />
                        <Route exact path="/chat" component={Chat} />
                        <Route path="/chat/:id" component={PrivateChat} />
                    </React.Fragment>
                </BrowserRouter>
            </React.Fragment>
        );
    }
}

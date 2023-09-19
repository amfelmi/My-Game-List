import Navigation from "../../Components/Navigation bar/Navbar"
import Searchbar from "../../Components/Search bar/Searchbar"
import Hero from "./Main content/Hero/Hero"
import NewReleases from "./Main content/New releases/NewReleases"
import Footer from "../../Components/Footer/Footer"
import AnticipatedList from "../Home page/Main content/Anticipated games/AnticipatedList"
import MiniList from "./Main content/Your list/MiniList"
import "./Home.css"

export default function Navbar() {

    return (
        <div>
            <Navigation />
            <div className="searchbar-component">
                <Searchbar />
            </div>
            <Hero />
            <NewReleases />
            <div className="twin-lists">
                <MiniList />
            </div>
            <div className="twin-lists">
                <AnticipatedList />
            </div>
            <Footer />
        </div>
    )
}
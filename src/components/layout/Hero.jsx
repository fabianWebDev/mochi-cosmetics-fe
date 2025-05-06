import classes from "./Hero.module.css";
import Button from "../ui/common/Button";
import { Link } from "react-router-dom";
const Hero = () => {
    return (
        <div className={`${classes.hero_container} mt-4`}>
            <div className="row">
                <h1 className={classes.hero_title}>Enter the Shadows of Minas Morgul — Where Darkness Deals the Cards.</h1>
            </div>
            <div className="row mt-3">
                <div className="col"></div>
                <div className={`${classes.hero_button_container} col-md-6`}>
                    <Link to="/products">
                        <Button>
                            See more
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Hero;  

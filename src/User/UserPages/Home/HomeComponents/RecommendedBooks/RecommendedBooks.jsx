import React from 'react'
import { Link } from 'react-router-dom'
import styles from "../RecommendedBooks/RecommendedBooks.module.css"
import Carousel from "../../../../../carousel/carouselOne/Carousel"
import CarouselTwo from '../../../../../carousel/carousel/CarouselTwo'


const RecommendedBook = () => {
  return (
    <div >
      <div className={styles.pageThreeMain}>
      <div className={styles.pgThree}>

        <div className={styles.boxOne}>
        <Carousel/>
        </div>

        <div className={styles.month}>
          {/* <p>_____</p> */}
        <p className={styles.monthOne}>this month's</p>
        <p className={styles.monthTwo}>RECOMMENDED BOOKS</p>
        {/* <p>_____</p> */}
        <hr />
      </div>

      <div className={styles.boxTwo}>
        <CarouselTwo/>
      </div>
      <div className={styles.thereMain}>
         <h1> <span>THERE'S NO</span> <span>SUCH THING AS TOO</span> <span></span>MANY BOOKS   </h1>
      </div>

      <div className={styles.buttonOne}>
        <Link to="/about">
          <button className={styles.buttonChild}>Read Our Story</button>
        </Link>
      </div>

      </div>
      </div>
      </div>
  
  )
}

export default RecommendedBook
import React from 'react'
import styles from "../Events/Events.module.css"
import image0 from "../../../../../assets/image2/0000.avif"

const Events = () => {
  return (
    <section id='PageFourr'>
      <div >
        <div className={styles.pageFour}>
            <div className={styles.comming}>
                <p className={styles.commingOne}>coming up</p>
                <p className={styles.commingTwo}>BOOK LAUNCH</p>
            </div>

            <div className={styles.mainDiv}>
                <div className={styles.divOne}>
                  <div className={styles.divOneContant}>
                    <h3 className={styles.land}>Introducing The Land of AILLO</h3>
                    <br />
                    <p className={styles.marker}>By Mark Walker</p> 
                    <br />
                    <p className={styles.when}>When</p>
                    {/* <p>____</p> */}
                  <p className={styles.time}>Jul 12, 2035, 7:00 PM</p>
                  <br />
                    <p className={styles.where}>Where</p>
                    {/* <p>____</p> */}
                    <p className={styles.terry}>500 Terry Francois Street,San Francisco,CA,USA</p>
                     <h2 className={styles.buttonOne}><button>rsvp now</button></h2>
                    </div>
                    </div>
                    
                    
                    <div className={styles.divTwo}>
                      <div className={styles.divTwocontant}>
                        <img src={image0} alt=""  className={styles.image}/>
                        </div>
                      </div>
                  

               </div>
                

        </div>
        </div>
    </section>
  )
}

export default Events
import React from 'react'
import styles from "../About/About.module.css"
import Footer from '../../Components/Footer/Footer'
const About = () => {
  return (
    <div>
      <div className={styles.AboutPage}>
        <div className={styles.aboutHead}>
          <h3 className={styles.AbHeadOne}>Our</h3>
          <h1 className={styles.AbHeadTwo}>Story</h1>
        </div>

        <div className={styles.bgOne}></div>
        <div className={styles.bgTwo}></div>
        <div className={styles.bgThree}>
          <p className={styles.threePtagOne}> I'm a paragraph. Click here to add your own text and edit me. It’s easy. Just click “Edit Text” or double click me to add your own content and make changes to the font. Feel free to drag and drop me anywhere you like on your <br /> <br />
    This is a great space to write long text about your company and your services. You can use this space to go into a little more detail about your company. Talk about your team and what services you provide. Tell your visitors the story of how you came up with the idea for your business and what makes you different from your competitors.</p>
  
      </div>
      </div>
      <div className={styles.footer}>
         <Footer/>
      </div>
     
   
    </div>
  )
}

export default About
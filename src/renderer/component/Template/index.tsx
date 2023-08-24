import React from 'react'
import styles from './template.scss'

const Template: React.FC = () => {
  console.log('----render Template')
  return (
    <div className={styles.temp}>
      <div className={styles.tempContent}>
         <div className={styles.tempTitle}>素材管理</div>
         <div className={styles.tempBody}></div>
      </div>
    </div>
  )
}

export default Template
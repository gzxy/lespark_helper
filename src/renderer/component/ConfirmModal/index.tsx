import { FC, useCallback, useState, useMemo } from 'react'
import { Modal } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import cx from 'classnames'
import { RootState } from '../../store/index'
import { closeConfirmShow } from '../../store/global'


const ConfirmModal: FC = () => {
   const {
    global: {
      confirmOptions,
      isConfirmShow
    },
  } = useSelector((s: RootState) => s)
  const dispatch = useDispatch()

  const handleOK = useCallback(()=>{
   confirmOptions.onOk && confirmOptions.onOk()
   dispatch(closeConfirmShow())
  },[confirmOptions])

  const handleCancel = useCallback(()=>{
   confirmOptions.onCancel && confirmOptions.onCancel()
   dispatch(closeConfirmShow())
  },[confirmOptions])
   return (
      <Modal title="" centered={true} wrapClassName='defaultConfirm' destroyOnClose={true} open={isConfirmShow} onCancel={handleCancel}>
        <div className="confirm-content">{confirmOptions.content}</div>
        <div className="confirm-btns">
            <div className="confirm-btn" onClick={handleOK}>{confirmOptions.okText}</div>
            <div className="confirm-btn btn-default"  onClick={handleCancel}>{confirmOptions.cancelText}</div>
        </div>
      </Modal>
   )
}


export default ConfirmModal
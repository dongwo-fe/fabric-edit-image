// @ts-nocheck
import React, { useContext, useEffect, useRef, useState } from 'react'
import styles from './index.module.scss'
import { useDropDown } from './dropDown';
import useAddObject from '../../../../Draw/hooks/useAddObject';
import { addImageApi, getImageList, postUploadImage } from '../../../../../api/image';
import { Context } from '../../../../Draw';

const ImageResource = () => {
  const {canvas} = useContext(Context)
  const EDIT_IMAGE_LIST = sessionStorage.getItem('EDIT_IMAGE_LIST')
  const userInfo = localStorage.getItem('userInfo')
  const [uploading, setUploading] = useState(false)
  const phone = userInfo ? JSON.parse(userInfo).phone : '15612868761';
  const {addImage} = useAddObject()
  const searchRef = useRef('')

  const [list, setList] = useState(EDIT_IMAGE_LIST ?
    JSON.parse(sessionStorage.getItem('EDIT_IMAGE_LIST')) :
    [])
  const {run} = useDropDown()


  useEffect(() => {
    queryList()
  }, [])

  // useEffect(() => {
  //   if (!canvas) return
  //   canvas.on('drop', onDrop)
  //   canvas.on('dragover', onDragover)
  //   return () => {
  //     canvas.off('drop', onDrop)
  //     canvas.off('dragover', onDragover)
  //   }
  // }, [canvas])

  // 添加画布的拖拽事件监听器
  const onDrop = ({e}) => {
    e.preventDefault()
    const imageUrl = e.dataTransfer.getData('text/plain');
    addImage(imageUrl, {
      left: e.layerX,
      top: e.layerY
    })
  }
  // 阻止画布的默认拖拽行为
  const onDragover = ({e}) => {
    e.preventDefault()
  }
  const onClickMore = (e: any, item: any) => {
    run(e, item)
  }
  /**
   * 获取图片数据
   */
  const queryList = async () => {
    try {
      const res = await getImageList({phone})
      sessionStorage.setItem('EDIT_IMAGE_LIST', JSON.stringify(res))
      setList(res)
    } catch (err) {
      console.log(err)
    }
  }
  /**
   * 上传文件
   * @param e
   */
  const onUploadFile = async (e: any) => {
    if (uploading) return
    setUploading(true)
    const [file] = e.target.files
    if (!/(png|jpg|jpeg)/g.test(file.type)) return
    try {
      const res = await postUploadImage(file)
      await addImageApi({
        phone,
        imgSrc: res.url
      })
      await queryList()
      setUploading(false)
    } catch (err) {
      setUploading(false)
    }
  }

  const onDragStart = e => {
    e.dataTransfer.setData('text/plain', e.target.src);
  }
  return (
    <div className={styles.imageResource}>
      {/*<div className={styles.searchBox}>*/}
      {/*  <input type='text' placeholder='请输入' onChange={e => searchRef.current = e.target.value}/>*/}
      {/*  <img src="https://ossprod.jrdaimao.com/file/1690356901972689.svg" alt=""/>*/}
      {/*</div>*/}
      <div className={styles.uploadFile}>
        <span>{uploading ? '上传中...' : '上传文件'}</span>
        <input disabled={uploading} type="file" accept='.png,.jpg,.jpeg' onChange={onUploadFile}/>
      </div>
      {
        !list.length ? <div className={styles.empty}>
          <img src="https://ossprod.jrdaimao.com/file/169035729200810.png" alt=""/>
          <p>还没有文件哦~</p>
        </div> : null
      }
      {
        list.length ? <div className={styles.fileList}>
          {
            list.map((item) => {
              return <div

                key={item._id}
                className={styles.fileListItem}
              >
                <img
                  onDragStart={onDragStart}
                  onError={e => {
                    e.target.style.cursor = 'not-allowed'
                    e.target.src = 'https://juranapp-prod.oss-cn-beijing.aliyuncs.com/file/1639966318079/picture'
                  }}
                  onClick={() => addImage(item.imgSrc)}
                  className={styles.image}
                  src={item.imgSrc}
                  alt=""
                />
                {/*右键菜单来不及做了，先不做*/}
                {/*<img*/}
                {/*  onClick={(e) => onClickMore(e, item)}*/}
                {/*  className={styles.more}*/}
                {/*  src="https://ossprod.jrdaimao.com/file/1690363754666532.svg"*/}
                {/*  alt=""*/}
                {/*/>*/}
              </div>
            })
          }
        </div> : null
      }
    </div>
  )
}

export default ImageResource

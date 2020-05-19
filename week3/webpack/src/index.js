import './index.scss'
import imgSrc from './happy.jpg'
import logo from './logo.png'

let pic = document.getElementById('pic')

let img1 = new Image();
let img2 = new Image();
img1.src = imgSrc
img2.src = logo
pic.append(img1)
pic.appendChild(img2)
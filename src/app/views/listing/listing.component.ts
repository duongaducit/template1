import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';

var canvasElement;
var asinCode;
var aThis;
@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
  @ViewChild('canvas', { static: false }) canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('templateHTML', { static: false }) templateHTML: ElementRef;
  linkAmz;
  listImg = [];
  listDescription = [];
  shopName = "Nhập sologan";
  imageCustom;
  imageDefault = "https://i.ibb.co/18QMnzD/Free-Sample-By-Wix.jpg";
  sellerEbay = "stastal22";
  titleProduct;
  imgMain;
  showTemplate = false;
  overlayLoad = false;
  errorGet = false;
  constructor(private httpClient: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object) { }

  ngOnInit(): void {
    aThis = this;
    if (isPlatformBrowser(this.platformId)) {
      let shopN = sessionStorage.getItem('shopName');
      let imgC = sessionStorage.getItem('imageCustom');
      let seller = sessionStorage.getItem('sellerEbay');

      if (shopN) this.shopName = shopN;
      if (imgC) this.imageCustom = imgC;
      if (seller) this.sellerEbay = seller;

    }
  }

  getDataAmz() {
    this.overlayLoad = true;
    this.errorGet = false;
    let body = {
      link_product: this.linkAmz
    }
    this.httpClient.post('http://listing.supportseller.com:4040/product/find', body).subscribe((res: any) => {
      if (res.image_list) {
        this.listImg = res.image_list;
      }

      if (res.description) {
        this.listDescription = res.description;
      }

      asinCode = res.asin_product;
      canvasElement = this.canvas.nativeElement;
      this.titleProduct = res.name_amz;
      exportImage(0, this.listImg);
      this.showTemplate = true;
      this.overlayLoad = false;
    }, err => {
      this.overlayLoad = false;
      this.errorGet = true;
    });
  }

  reset() {
    this.showTemplate = false;
  }
  
  copyHtml() {
    sessionStorage.setItem('shopName', this.shopName);
    if (this.imageCustom) sessionStorage.setItem('imageCustom', this.imageCustom);
    sessionStorage.setItem('sellerEbay', this.sellerEbay);
    document.addEventListener('copy', (e: ClipboardEvent) => {
      let text = this.templateHTML.nativeElement.innerHTML;
      
      e.clipboardData.setData('text/plain', text);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
  }

  exImg(imgL) {
    var ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      let width = img.width;
      let height = img.height;
      let nHeight = 500 * height / width;
      canvasElement.width = 500;
      canvasElement.height = nHeight;
      ctx.drawImage(img, 0, 0, 500,nHeight);

      var img2 = new Image();
      img2.onload = function () {
        ctx.drawImage(img2, 10, 10, 222, 160);
        let imgSrc = canvasElement.toDataURL("image/png");

        var a = document.createElement("a"); //Create <a>
        a.href = imgSrc; //Image Base64 Goes here
        a.download = "eximg.png"; //File name Here
        a.click();
      }
      img2.src = "../../../assets/img/listing/freeshipping.png";
    };
    img.src = imgL;
  }
  
}

function exportImage(idx, listImg) {
  if (idx > listImg.length) {

  } else {
    var ctx = canvasElement.getContext('2d');
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    var img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = function () {
      let width = img.width;
      let height = img.height;
      let nHeight = 500 * height / width;
      canvasElement.width = 500;
      canvasElement.height = nHeight;
      ctx.drawImage(img, 0, 0, 500,nHeight);

      var img2 = new Image();
      img2.onload = function () {
        ctx.drawImage(img2, 10, 10, 222, 160);

        var img3 =  new Image();
        img3.onload = function () {
          ctx.drawImage(img3, 390, 10, 100, 100);
          let imgSrc = canvasElement.toDataURL("image/png");

          var a = document.createElement("a"); //Create <a>
          a.href = imgSrc; //Image Base64 Goes here
          a.download = asinCode + "_" + idx + ".png"; //File name Here
          a.click();
          exportImage((idx + 1), listImg);
        }
        img3.src = "../../../assets/img/listing/logo.png"
        
      }
      img2.src = "../../../assets/img/listing/freeshipping.png";
    };
    img.src = listImg[idx];
  }

}
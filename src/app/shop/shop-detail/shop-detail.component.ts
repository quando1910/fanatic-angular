import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ShopsService } from '../../shared/services/shops.service';
import { ProductService } from '../../shared/services/product.service';
import { ProductListComponent } from '../../product/product-list/product-list.component';
import { PaginationComponent } from '../../shared/layout/pagination/pagination.component';
import { environment } from '../../../environments/environment';
declare var google: any;

@Component({
  selector: 'app-shop-detail',
  templateUrl: './shop-detail.component.html',
  styleUrls: ['./shop-detail.component.scss'],
  providers: [ShopsService, ProductService]
})
export class ShopDetailComponent implements OnInit{
  id: number;
  shop: any;
  products: any;
  page: number;
  url: any;


  @ViewChild(PaginationComponent) pagination: PaginationComponent;
  @ViewChild(ProductListComponent) productList: ProductListComponent;
  constructor(private route: ActivatedRoute, 
    private shopsService: ShopsService,
    private productService: ProductService,
    private router: Router) {
  }

  ngOnInit() {
    this.url=this.router.url;
    this.route.params.subscribe(params => {
      this.id=params['name'];
      this.page=+params['page'];
      this.shopsService.getShop(this.id).subscribe(data => {});
      this.shopsService._shopSubject.subscribe(shop => {
        this.shop = shop;
        $(document).ready(() => {
          var geocoder = new google.maps.Geocoder();
          var address = shop.address;
          geocoder.geocode({ 'address' : address }, (results, status) => {
            if(status == google.maps.GeocoderStatus.OK) {
              var latitude = results[0].geometry.location.lat();
              var longitude = results[0].geometry.location.lng();
            }
            var mapCanvas = document.getElementById('map');
            var location = new google.maps.LatLng(latitude, longitude)
            var mapOptions = {
              center: location,
              zoom: 17,
              panControle: false,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };
            var markerIcon = {
              url: 'http://image.flaticon.com/icons/svg/252/252025.svg',
              scaledSize: new google.maps.Size(80, 80),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(32, 65),
              labelOrigin:  new google.maps.Point(40, 33),
            };
            var map = new google.maps.Map(mapCanvas, mapOptions);
            var markerLabel = 'GO!';
            var marker = new google.maps.Marker({
              position: location,
              draggable: true,
              animation: google.maps.Animation.DROP,
              map: map,
              icon: markerIcon,
              label: {
                text: markerLabel,
                color: "#eb3a44",
                fontSize: "16px",
                fontWeight: "bold",
              }
            });
            marker.addListener('click', () => {
              marker.setAnimation(google.maps.Animation.BOUNCE);
            });
            var contentString = '<div class="info-window" style="border-radius: 5px;">' +
            `<div style="float: left;width: 25%">
            <img src="${shop.logo}" style="width: 70px; height: auto;">
            </div>` + 
            `<div style="float:left;width: 70%;margin-left: 5%;color: gray; font-size: 16px">` +
            `<span style="display: inline-block">Shop's name: ${shop.name}</span>` + 
            `<span style="display: inline-block">Shop's address: ${shop.address}</span>` +
            `</div>` +
            `</div>`;
            var inforWindow = new google.maps.InfoWindow({
              content: contentString,
              maxWidth: 250,
            });
            marker.addListener('click', () => {
              inforWindow.open(map, marker);
            });
          })
        })
      })
      this.productService.getProductByShop(this.id,this.page).subscribe(data => {});
      this.productService._ProductByShopSubject.subscribe(product => {
        if (product && this.productList) {
          this.products=product;
          this.productList.products=this.products;
        }
      })
      this.productService._countShop.subscribe(count => {
        if (this.pagination) {
          this.pagination.setPageNumber(Math.ceil(count/12));
        }
      })
    })
  }
}

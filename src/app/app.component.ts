import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { sortBy } from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public tokens: any[];
  public rariPepeOnSale: any[] = [];
  public pepeWorks: any[] = [];

  constructor(private httpClient: HttpClient) {
  }

  public ngOnInit() {
    const unequipped = '0x729cd6226751279030757f61b2cac4798c949fa1%3A10';
    const bbpants1 = '0xd07dc4262bcdbf85190c01c996b4c06a461d2430%3A45927';
    this.httpClient.get(`https://api-mainnet.rarible.com/items/${bbpants1}/ownerships`)
      .subscribe((data: any[]) => {
        const filteredData = data.filter(d => d.selling > 0);

        this.tokens = sortBy(filteredData, d => d.price);

        // this.tokens.filter(t => t.pending.length > 0).forEach(t => console.log(t));
      })

    this.getOnSaleRariPepe();
    this.getAllPepeWorks();
  }

  public getAllPepeWorks() {
    const RariPepeId = '0xb195e2336952a177bc3c5543d4bd61d1c38cac2e'

    const filter = {
      'size': 1000,
      'filter': {
        '@type': 'by_creator',
        'address': RariPepeId,
      }
    }
    this.httpClient.post('https://api-mainnet.rarible.com/ownerships', filter).subscribe((data: any[]) => {
      console.log(data);
      const filtered = data
        .filter(i => i.ownership.selling > 0);

      const sorted = sortBy(filtered, d => d.ownership.price);
      this.pepeWorks = sorted;
    })
  }



  public getOnSaleRariPepe() {
    const RariPepeId = '0xb195e2336952a177bc3c5543d4bd61d1c38cac2e'

    const filter = {
      'size': 100,
      'filter': {
        '@type': 'by_owner',
        'address': RariPepeId,
        'incoming': true,
        'inStockOnly': true
      }
    }
    this.httpClient.post('https://api-mainnet.rarible.com/ownerships', filter).subscribe((data: any[]) => {
      this.rariPepeOnSale = data
        .filter(d => d.item.creator === RariPepeId)
    })
  }
}

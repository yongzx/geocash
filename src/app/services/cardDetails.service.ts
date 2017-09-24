import { Injectable } from '@angular/core';
import { Headers, Http, Response } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { CardDetails } from './cardDetails';

@Injectable()
export class CardDetailsService {
  private cardDetailsUrl = 'sandbox.apihub.citi.com/gcb/api/v1/cards?cardFunction=ALL'

  constructor(private http: Http) { }

  getCardDetails(): Promise<Array<CardDetails>> {
    return this.http
      .get(this.cardDetailsUrl)
      .toPromise()
      .then((response) => {
        return response.json().cardDetails as CardDetails[];
      })
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error.message || error);
  }

  getCardDetails(cardId: string): Promise<CardDetails> {
    return this.getCardDetails()
      .then(res => res.json().cardDetails as CardDetails[])
      .catch();
  }

  save(card: CardDetails): Promise<CardDetails> {
    if (card.cardId) {
      return this.put(card);
    }
    return this.post(card);
  }

  delete(card: CardDetails): Promise<Response> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.cardDetailsUrl}/${card.cardId}`;

    return this.http
      .delete(url, { headers: headers })
      .toPromise()
      .catch(this.handleError);
  }

  // Add new CardDetails
  private post(card: CardDetails): Promise<CardDetails> {
    const headers = new Headers({
      'Content-Type': 'application/json'
    });

    return this.http
      .post(this.cardDetailsUrl, JSON.stringify(card), { headers: headers })
      .toPromise()
      .then(res => res.json().cardDetails)
      .catch(this.handleError);
  }

  // Update existing CardDetails
  private put(card: CardDetails): Promise<CardDetails> {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const url = `${this.cardDetailsUrl}/${card.cardId}`;

    return this.http
      .put(url, JSON.stringify(card), { headers: headers })
      .toPromise()
      .then(() => card)
      .catch(this.handleError);
  }
}
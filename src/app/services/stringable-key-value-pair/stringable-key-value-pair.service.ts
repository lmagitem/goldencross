import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { SubSink } from 'subsink';
import { StringableKeyValuePair } from '../../shared/models/stringable-key-value-pair.model';

/** Methods to reduce the boilerplate when making and using key-value pairs from other objects. */
@Injectable({
  providedIn: 'root',
})
export class StringableKeyValuePairService {
  /** Returns an array of key-value pairs using the given objects.
   *  @param source The objects to transform.
   *  @param keyField The attribute to use as key in the key-value pair.
   *  @param valueField The attribute to use as value in the key-value pair - it must be a field easily
   *  displayable as a string, or the .toString() method of the returned pairs won't be very useful. */
  public getArrayOfPairs(
    source: any[] | Observable<any[]>,
    keyField: string,
    valueField: string
  ): Array<StringableKeyValuePair<any>> {
    const list: StringableKeyValuePair<any>[] = [];
    if (source === undefined || source === null) {
      return list;
    }
    if (!!!keyField) {
      throw new Error(
        `La variable censée être utilisée pour la clef est invalide.`
      );
    }
    if (!!!valueField) {
      throw new Error(
        `La variable censée être utilisée pour la valeur est invalide.`
      );
    }
    if (source instanceof Observable) {
      source.pipe().subscribe((items) => {
        if (!!items) {
          items.forEach((item) =>
            this.transformAndPush(list, item, keyField, valueField)
          );
        }
      });
    } else {
      if (Array.isArray(source)) {
        source.forEach((item) =>
          this.transformAndPush(list, item, keyField, valueField)
        );
      } else {
        throw new Error(
          `La variable fournie ne contient ni un observable, ni un tableau de valeurs.`
        );
      }
    }
    return list;
  }

  /** Returns an observable that returns an array of key-value pairs using the given observable or array.
   *  @param source The objects to transform, or an observable returning them.
   *  @param keyField The attribute to use as key in the key-value pair.
   *  @param valueField The attribute to use as value in the key-value pair - it must be a field easily
   *  displayable as a string, or the .toString() method of the returned pairs won't be very useful.
   *  @param subs The SubSink instance of whatever componant calls this method. Used to store the subscription
   * to the observable passed in parameter. */
  public getObservableArrayOfPairs(
    source: any[] | Observable<any[]>,
    keyField: string,
    valueField: string,
    subs: SubSink
  ): Observable<Array<StringableKeyValuePair<any>>> {
    return new Observable((subscriber) => {
      if (source instanceof Observable) {
        if (!!subs) {
          subs.sink = source.subscribe((items) => {
            subscriber.next(this.getArrayOfPairs(items, keyField, valueField));
          });
        } else {
          throw new Error(
            'Veuillez passer une instance de SubSink pour la création de cet observable pour éviter les fuites mémoire !'
          );
        }
      } else {
        subscriber.next(this.getArrayOfPairs(source, keyField, valueField));
      }
    });
  }

  /** Transforms an object in a key-value pair and stores it in the given array.
   *  @param list The array in which to push the newly minted key-value pair.
   *  @param item The object to transform.
   *  @param keyField The attribute to use as key in the key-value pair.
   *  @param valueField The attribute to use as value in the key-value pair - it must be a field easily
   *  displayable as a string, or the .toString() method of the returned pairs won't be very useful. */
  private transformAndPush(
    list: Array<StringableKeyValuePair<any>>,
    item: any,
    keyField: string,
    valueField: string
  ) {
    if (keyField in item) {
      if (valueField in item) {
        list.push(
          new StringableKeyValuePair(
            item[keyField],
            item[valueField],
            (data) => data + ''
          )
        );
      } else {
        throw new Error(
          `L'objet fourni ne possède pas d'attribut "` +
            valueField +
            `", censé être utilisé pour la valeur.`
        );
      }
    } else {
      throw new Error(
        `L'objet fourni ne possède pas d'attribut "` +
          keyField +
          `",  censé être utilisé pour la clef.`
      );
    }
  }
}

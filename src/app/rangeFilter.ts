import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'range'
})
export class Range implements PipeTransform {

  transform(n: number): number[] {
    let arr = [];
    for (let i = 0; i < n; i++) {
        arr.push(i);
    }

    return arr;
  }
}
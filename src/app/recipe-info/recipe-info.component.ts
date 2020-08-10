import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrls: ['./recipe-info.component.sass']
})
export class RecipeInfoComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() variant: string;
  allPhotos: HTMLImageElement[];

  constructor(/*private infoService: RecipeInfoService*/) { }

  ngOnInit(): void {
  }

}

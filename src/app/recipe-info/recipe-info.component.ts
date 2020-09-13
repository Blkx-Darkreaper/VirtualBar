import { Component, OnInit, Input } from '@angular/core';
import { RecipeInfoService } from '../Services/recipe-info.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-info',
  templateUrl: './recipe-info.component.html',
  styleUrls: ['./recipe-info.component.sass']
})
export class RecipeInfoComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() variant: string;
  allImageLinks: URL[];

  constructor(private infoService: RecipeInfoService) { }

  ngOnInit(): void {
    this.allImageLinks = [];
  }

  ngOnChanges(): void {
    this.updateInfo(this.id);
  }

  private updateInfo(recipeId: number) {
    this.allImageLinks = [];

    this.infoService.GetRecipeImagesFromAirtable(recipeId)
    .pipe(
      map(response => {
        let allImageLinks = [];
        if(!("Attachments" in response.records[0].fields)) {
          return allImageLinks;
        }

        allImageLinks = response.records[0].fields["Attachments"].map(
          attachmentObj => {
            let url: string = attachmentObj.url;
            // console.log("Url(" + url + ")");  //debug

            let imageLink: URL = new URL(url);
            return imageLink;
          }
        )

      return allImageLinks;
    }))
    .subscribe((data: URL[]) => {
      // console.log("Links(" + data.toString() + ")"); //debug

      this.allImageLinks = data;
    });
  }
}

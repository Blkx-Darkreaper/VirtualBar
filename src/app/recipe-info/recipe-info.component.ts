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
  allPrepStyles: string[];
  allGlasses: string[];
  allIce: string[];
  allCocktailFamilies: string[];
  allOccasions: string[];
  allImageLinks: URL[];
  relatedTo: string;
  notes: string;
  ounces: string;
  millilitres: string;

  constructor(private infoService: RecipeInfoService) { }

  ngOnInit(): void {
    this.allPrepStyles = [];
    this.allGlasses = [];
    this.allIce = [];
    this.allCocktailFamilies = [];
    this.allOccasions = [];
    this.allImageLinks = [];
    this.relatedTo = "";
    this.notes = "";
    this.ounces = "~";
    this.millilitres = "~";
  }

  ngOnChanges(): void {
    this.updateInfo(this.id);
  }

  private updateInfo(recipeId: number) {
    this.allPrepStyles = [];
    this.getAllPrepStyles(recipeId);

    this.allGlasses = [];
    this.getAllGlasses(recipeId);

    this.allIce = [];
    this.getAllIce(recipeId);

    this.allCocktailFamilies = [];
    this.getAllCocktailFamilies(recipeId);

    this.allOccasions = [];
    this.getAllOccasions(recipeId);

    this.allImageLinks = [];
    this.getAllImages(recipeId);

    this.relatedTo = "";
    this.getRelatedTo(recipeId);

    this.notes = "";
    this.getNotes(recipeId);

    this.ounces = "~";
    this.millilitres = "~";
    this.getVolume(recipeId);
  }

  private getAllPrepStyles(recipeId: number) {
    this.infoService.GetPrepStylesFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allStyles = [];

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Prep Style Names" in response.records[0].fields)) {
            return allStyles;
          }
          
          allStyles = response.records[0].fields["Prep Style Names"];
          // console.log("Prep Styles(" + allStyles.join(', ') + ")"); //debug

          return allStyles;
        }))
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
          console.log("Prep Styles(" + filteredList.join(', ') + ")"); //debug
  
          let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
  
          filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

          this.allPrepStyles = filteredList;
      });
  }

  private getAllGlasses(recipeId: number) {
    this.infoService.GetGlassFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allGlasses = [];

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Glass Names" in response.records[0].fields)) {
            return allGlasses;
          }
          
          allGlasses = response.records[0].fields["Glass Names"];
          // console.log("Glasses(" + allGlasses.join(', ') + ")"); //debug

          return allGlasses;
        }))
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
          console.log("Glasses(" + filteredList.join(', ') + ")"); //debug
  
          let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
  
          filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

          this.allGlasses = filteredList;
      });
  }

  private getAllIce(recipeId: number) {
    this.infoService.GetServedFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allIce = [];

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Served Names" in response.records[0].fields)) {
            return allIce;
          }
          
          allIce = response.records[0].fields["Served Names"];
          // console.log("Ice(" + allIce.join(', ') + ")"); //debug

          return allIce;
        }))
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
          console.log("Ice(" + filteredList.join(', ') + ")"); //debug
  
          let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
  
          filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

          this.allIce = filteredList;
      });
  }

  private getAllCocktailFamilies(recipeId: number) {
    this.infoService.GetCocktailFamiliesFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allFamilies = [];

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Family Names" in response.records[0].fields)) {
            return allFamilies;
          }
          
          allFamilies = response.records[0].fields["Family Names"];
          // console.log("Families(" + allIce.join(', ') + ")"); //debug

          return allFamilies;
        }))
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
          console.log("Families(" + filteredList.join(', ') + ")"); //debug
  
          let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
  
          filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

          this.allCocktailFamilies = filteredList;
      });
  }

  private getAllOccasions(recipeId: number) {
    this.infoService.GetOccasionsFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allOccasions = [];

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Occasion Names" in response.records[0].fields)) {
            return allOccasions;
          }
          
          allOccasions = response.records[0].fields["Occasion Names"];
          // console.log("Occasions(" + allOccasions.join(', ') + ")"); //debug

          return allOccasions;
        }))
      .subscribe((data: string[]) => {
        let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
          console.log("Occasions(" + filteredList.join(', ') + ")"); //debug
  
          let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
  
          filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates

          if(filteredList.length == 0) {
            filteredList.push("None");
          }
  
          this.allOccasions = filteredList;
      });

      // this.infoService.GetOccasionsFromAirtable(recipeId)
      // .pipe(
      //   map(response => {
      //     let allValues = response.records.map(
      //       obj => {
      //         return obj.fields["Occasion Names"];
      //       }
      //     );

      //     return allValues;
      //   }))
      //   .subscribe((data: string[]) => {
      //     let filteredList = data.filter(n => n !== null && n !== undefined); // Remove blanks
      //     console.log("Occasions(" + filteredList.join(', ') + ")"); //debug
  
      //     let sortedList = filteredList.sort((a, b) => a.localeCompare(b));
  
      //     filteredList = sortedList.filter((n, i) => sortedList.indexOf(n) === i); // Remove duplicates
  
      //     this.allOccasions = filteredList;
      //   });
  }

  private getAllImages(recipeId: number) {
    this.infoService.GetRecipeImagesFromAirtable(recipeId)
      .pipe(
        map(response => {
          let allImageLinks = [];

          if (!("Attachments" in response.records[0].fields)) {
            return allImageLinks;
          }

          allImageLinks = response.records[0].fields["Attachments"].map(
            attachmentObj => {
              let url: string = attachmentObj.url;
              // console.log("Url(" + url + ")");  //debug
              let imageLink: URL = new URL(url);
              return imageLink;
            }
          );

          return allImageLinks;
        }))
      .subscribe((data: URL[]) => {
        // console.log("Links(" + data.toString() + ")"); //debug
        this.allImageLinks = data;
      });
  }

  private getRelatedTo(recipeId: number) {
    this.infoService.GetRelatedToFromAirtable(recipeId)
      .pipe(
        map(response => {
          let relatedTo = "";

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Related to" in response.records[0].fields)) {
            return relatedTo;
          }
          
          relatedTo = response.records[0].fields["Related to"];
          // console.log("Related to(" + relatedTo + ")"); //debug

          return relatedTo;
        }))
      .subscribe((data: string) => {
          this.relatedTo = data;
      });
  }

  private getNotes(recipeId: number) {
    this.infoService.GetNotesFromAirtable(recipeId)
      .pipe(
        map(response => {
          let notes = "";

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Notes" in response.records[0].fields)) {
            return notes;
          }
          
          notes = response.records[0].fields["Notes"];
          // console.log("Notes(" + notes + ")"); //debug

          return notes;
        }))
      .subscribe((data: string) => {
          this.notes = data;
      });
  }

  private getVolume(recipeId: number) {
    this.infoService.GetOuncesFromAirtable(recipeId)
      .pipe(
        map(response => {
          let oz = "~";

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Total Volume (oz)" in response.records[0].fields)) {
            return oz;
          }
          
          let ozNum = response.records[0].fields["Total Volume (oz)"];
          // console.log("Oz(" + ozNum + ")"); //debug

          if(isNaN(ozNum) != true) {
            oz = String(Math.round(ozNum * 100) / 100);
          }

          return oz;
        }))
      .subscribe((data: string) => {
          this.ounces = data;
      });

      this.infoService.GetMillilitresFromAirtable(recipeId)
      .pipe(
        map(response => {
          let mils = "~";

          for(let i in response.records[0].fields) {
            let field = response.records[0].fields[i];
            // console.log("Response(" + field + ")");  //debug
          }

          if (!("Total Volume (mL)" in response.records[0].fields)) {
            return mils;
          }
          
          let milNum = response.records[0].fields["Total Volume (mL)"];
          // console.log("mL(" + milNum + ")"); //debug

          if(isNaN(milNum) != true) {
            mils = String(Math.round(milNum * 100) / 100);;
          }

          return mils;
        }))
      .subscribe((data: string) => {
          this.millilitres = data;
      });
  }
}
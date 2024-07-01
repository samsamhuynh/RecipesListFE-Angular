import { Component } from "@angular/core";
import { DataStorgeService } from "../shared/data-storage.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent {
  constructor(private dataStorageService: DataStorgeService) {}

  onSaveData() {
    this.dataStorageService.storeRecipes();
  }
}

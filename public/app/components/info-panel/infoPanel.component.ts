import { Component, OnInit } from '@angular/core';
import { InfoService } from '../../services/info.service';
import { ClickOutsideDirective } from '../../utils/actionByOutsideClick.directive';

@Component({
  selector: 'info-panel',
  templateUrl: `./app/components/info-panel/infoPanel.component.html`,
  styleUrls: ['./app/components/info-panel/infoPanel.component.css'],
  providers: [InfoService],
  directives: [ClickOutsideDirective]
})
export class InfoPanelComponent implements OnInit {
  private books: Number;
  private users: Number;

  ngOnInit() {
    this.loadStatistics();
  }

  constructor(private _infoService: InfoService) {
  }

  loadStatistics() {
    this._infoService.loadStatistics().subscribe(
      (res) => { this.storeData(res); },
      (err) => { console.error(err); }
    );
  }

  storeData(response) {
    console.log(response);
    var body = JSON.parse(response["_body"]);
    this.books = body["books"];
    this.users = body["users"];
  }

  showDropDownMenu() {
    document.getElementById("myDropdown").classList.toggle("show");
  }

  hideDropDownMenu() {
    document.getElementById("myDropdown").classList.remove("show");
  }
}

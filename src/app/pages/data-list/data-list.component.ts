import { Component, OnInit, inject } from '@angular/core';
import { RouterModule } from '@angular/router'
import APIService, { APIModel } from '../../services/api.service.js'
import { SpinnerComponent } from '../../components/spinner/spinner.component.js'

@Component({
  selector: 'app-data-list[data-page-component]',
  standalone: true,
  imports: [RouterModule, SpinnerComponent],
  templateUrl: './data-list.component.html',
  styleUrl: './data-list.component.css',
})
export class DataListComponent implements OnInit {

  private _apiService = inject(APIService)

  listData: APIModel[] = []

  async ngOnInit() {
    this.listData = await this._apiService.getAllData()
  }

}

import { Component, OnInit } from '@angular/core';
import { IProfile, ProfileService } from 'src/app/services/profile.service';
import { TranslateConfigService } from 'src/app/services/translate-config.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css']
})
export class ProfileSettingsComponent implements OnInit {
  public title = 'Profile';
  public user: IProfile;
  public userCopy: IProfile;
  public isLoading = true;
  public isError = false;
  public isSaveProfile = false;
  public errorMessage : string;

  constructor(private profile: ProfileService, private translateConfigService : TranslateConfigService) { }

  ngOnInit(): void {
    this.getProfile();
  }
  
  getProfile(){
    this.profile.getProfileUser().then(response => {
      this.isLoading = true;
      this.user = response;
      this.userCopy = JSON.parse(JSON.stringify(this.user))
    })
    .catch(error => {
      this.isError = true;
      this.errorMessage = error.error;
      this.getProfile();
    })
    .finally(()=>{
      if(this.user != undefined){
        this.isError = false;
        this.isLoading = false;
      }
    })
  }

  setName(firstName: string,lastName: string){
    this.isSaveProfile = true;
    this.isError = false;
    this.profile.setName(firstName,lastName).then((response:IProfile) => {
      this.user.firstName = response.firstName;
      this.user.lastName = response.lastName;
      this.profile.setUserEmail(this.user.firstName,this.user.lastName).then((response:IProfile) => {
        this.user.email = response.email;
      })
      .catch(error => {
        this.user  = this.userCopy;
        this.isError = true;
        this.errorMessage = error.error;
      })
      .finally(()=>{
        this.isSaveProfile = false;
      })
    })
    .catch(error => {
      this.user  = this.userCopy;
      this.isError = true;
      this.errorMessage = error.error;
    })
    .finally(()=>{
      this.isSaveProfile = false;
    })
  }

  changeLang(type: string){
    this.translateConfigService.changeLanguage(type);
  }

}

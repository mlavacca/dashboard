import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ProjectService, UserService } from '../../core/services';
import { AppConfigService } from '../../app-config.service';
import { ProjectEntity } from '../../shared/entity/ProjectEntity';
import { MemberEntity, MemberProject } from '../../shared/entity/MemberEntity';
import { UserGroupConfig } from '../../shared/model/Config';
import { EditMemberComponent } from '../edit-member/edit-member.component';

@Component({
  selector: 'kubermatic-member-item',
  templateUrl: './member-item.component.html',
  styleUrls: ['./member-item.component.scss'],
})
export class MemberItemComponent implements OnInit {
  @Input() index: number;
  @Input() project: ProjectEntity;
  @Input() member: MemberEntity;
  public userGroupConfig: UserGroupConfig;
  public userGroup: string;

  constructor(private projectService: ProjectService,
              private dialog: MatDialog,
              private appConfigService: AppConfigService,
              private userService: UserService) {}

  public ngOnInit(): void {
    this.userGroupConfig = this.appConfigService.getUserGroupConfig();
    this.userService.currentUserGroup(this.project.id).subscribe(group => {
      this.userGroup = group;
    });
  }

  public getMemberItemClass(): string {
    if (this.index % 2 !== 0) {
      return 'odd';
    }
  }

  public getGroup(memberProjects: MemberProject[]): string {
    for (const i of Object.keys(memberProjects)) {
      if (memberProjects[i].id === this.project.id) {
        return memberProjects[i].group;
      }
      return '';
    }
  }

  public editMember() {
    const modal = this.dialog.open(EditMemberComponent);
    modal.componentInstance.project = this.project;
    modal.componentInstance.member = this.member;
    const sub = modal.afterClosed().subscribe(edited => {
      if (edited) {
        // this.reloadMembers();
      }
      sub.unsubscribe();
    });
  }
}

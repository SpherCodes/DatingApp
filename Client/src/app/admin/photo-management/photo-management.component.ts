import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Photo } from '../../_Models/photo';
import { AdminService } from '../../_services/admin.service';

@Component({
  selector: 'app-photo-management',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './photo-management.component.html',
  styleUrl: './photo-management.component.css',
})
export class PhotoManagementComponent implements OnInit {
  photos: Photo[] = [];
  private adminService = inject(AdminService);
  ngOnInit(): void {
    this.getPhotosForApproval();
  }
  getPhotosForApproval() {
    this.adminService.getPhotosForApproval().subscribe({
      next: (photos) => (this.photos = photos),
    });
  }
  approvePhoto(photoId: number) {
    this.adminService.approvePhoto(photoId).subscribe({
      next: () =>
        this.photos.splice(
          this.photos.findIndex((p) => p.id === photoId),
          1
        ),
    });
  }
  rejectPhoto(photoId: number) {
    this.adminService.rejectPhoto(photoId).subscribe({
      next: () =>
        this.photos.splice(
          this.photos.findIndex((p) => p.id === photoId),
          1
        ),
    });
  }

  handleImageError(event: any) {
    const imgElement = event.target;
    imgElement.src = '../../../assets/user.png';
  }
}

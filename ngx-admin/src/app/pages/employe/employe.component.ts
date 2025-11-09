import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Employe } from '../../model/employe';
import { EmployeService } from '../../services/employe.service';

@Component({
  selector: 'app-employe',
  templateUrl: './employe.component.html',
  styleUrls: ['./employe.component.scss'],
})
export class EmployeComponent implements OnInit {
  listemploye: Employe[] = [];
  selectedFiles: { [key: number]: File } = {};
  previewUrls: { [key: number]: any } = {};

  constructor(
    private employeService: EmployeService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees() {
    this.employeService.getEmployes().subscribe(
      data => {
        // compute a stable image URL per employee to avoid ExpressionChangedAfterItHasBeenCheckedError
        this.listemploye = (data || []).map(emp => {
          const filename = (emp as any).image || (emp as any).imageUrl || (emp as any).imageName || (emp as any).photo;
          // store a computed, stable URL on the object once
          (emp as any)._imageUrl = filename
            ? this.employeService.getEmployeeImageUrl(filename)
            : 'assets/default-avatar.png';
          return emp;
        });
      },
      err => console.error(err),
    );
  }

  onFileSelected(event: any, empId: number) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFiles[empId] = file;

    // Prévisualisation locale
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrls[empId] = this.sanitizer.bypassSecurityTrustUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

  uploadImage(empId: number) {
    const file = this.selectedFiles[empId];
    if (!file) return;

    this.employeService.uploadImage(empId, file).subscribe(
      updatedEmp => {
        alert('Image uploadée avec succès !');

        // Mettre à jour l'image dans la liste locale
        const index = this.listemploye.findIndex(emp => emp.id === empId);
        if (index !== -1) {
          // Keep both properties up-to-date so template/service can read either
          const filename =
            (updatedEmp as any).imageUrl ||
            (updatedEmp as any).image ||
            (updatedEmp as any).imageName ||
            (updatedEmp as any).photo;
          this.listemploye[index].image = filename;
          this.listemploye[index].imageUrl = filename;
          // recompute the stable URL once after upload
          (this.listemploye[index] as any)._imageUrl = filename
            ? this.employeService.getEmployeeImageUrl(filename)
            : 'assets/default-avatar.png';
        }

        delete this.selectedFiles[empId];
        delete this.previewUrls[empId];
      },
      err => {
        console.error('Erreur lors de l’upload :', err);
        alert('Erreur lors de l’upload');
      },
    );
  }

  getImageUrl(emp: Employe): string {
    // If there's a local preview (before upload), return the preview (already sanitized)
    if (this.previewUrls[emp.id]) return this.previewUrls[emp.id];

    // Accept multiple possible property names returned by backend
    const filename = (emp as any).image || (emp as any).imageUrl || (emp as any).imageName || (emp as any).photo;

    // If there's no filename, return default avatar from assets
    if (!filename) return 'assets/default-avatar.png';

    // If backend already returned a full URL or a data URL, return it as-is
    if (
      typeof filename === 'string' &&
      (filename.startsWith('http') || filename.startsWith('data:') || filename.startsWith('blob:'))
    ) {
      return filename;
    }

    // Otherwise build full URL via service
    return this.employeService.getEmployeeImageUrl(filename);
  }
}

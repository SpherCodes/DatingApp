using System.Security.Claims;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class VisitsController(IUnitOfWork unitOfWork, IMapper mapper) : ControllerBase
    {
        // Records when a user visits another user's profile
        [HttpPost("{visitedUserId}")]
        public async Task<ActionResult> RecordVisit(int visitedUserId)
        {
            var visitorId = User.GetUserId();
            var visitedUser = await unitOfWork.UserRepository.GetUserByIdAsync(visitedUserId);

            if (visitedUser == null) return NotFound();

            var visitorList = await unitOfWork.UserRepository.GetUserVisitorsAsync(visitedUserId, paginationParams: new PaginationParams
            {
                PageNumber = 1,
                PageSize = int.MaxValue
            });

            if (visitorList.Any(v => v.VisitorId == visitorId))
            {
                var existingVisit = visitorList.First(v => v.VisitorId == visitorId);
                existingVisit.VisitDate = DateTime.UtcNow;
            }
            else
            {
                var visit = new UserVisit
                {
                    VisitorId = visitorId,
                    VisitedId = visitedUserId,
                    VisitDate = DateTime.UtcNow
                };
                unitOfWork.UserRepository.AddVisit(visit);
            }

            if (await unitOfWork.Complete())
                return Ok();
            else
                return BadRequest("Failed to record visit");
        }        // Only VIP users can see who visited their profile
        [Authorize(Policy = "VIPRole")]
        [HttpGet("visitors")]
        public async Task<ActionResult<IEnumerable<VisitDto>>> GetVisitors([FromQuery] PaginationParams paginationParams)
        {
            var userId = User.GetUserId();
            var visits = await unitOfWork.UserRepository.GetUserVisitorsAsync(userId, paginationParams);

            Response.AddPaginationHeader(paginationParams.PageNumber, paginationParams.PageSize, visits);

            return Ok(visits);
        }
        [Authorize(Policy = "VIPRole")]
        [HttpGet("visits")]
        public async Task<ActionResult<IEnumerable<VisitDto>>> GetVisits([FromQuery] PaginationParams paginationParams)
        {
            var userId = User.GetUserId();
            var visits = await unitOfWork.UserRepository.GetUserVisitsAsync(userId, paginationParams);

            Response.AddPaginationHeader(paginationParams.PageNumber, paginationParams.PageSize, visits);

            return Ok(visits);
        }
    }
}